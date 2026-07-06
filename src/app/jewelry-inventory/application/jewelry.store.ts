import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs/operators';
import { IamStore } from '../../iam/application/iam.store';
import { JewelryApi } from '../infrastructure/jewelry-api';
import { JewelryProduct, CertState, TraceabilityEvent } from '../domain/model/jewelry-product.entity';
import { JewelryCertificate } from '../domain/model/jewelry-certificate.entity';

// Re-export domain types consumed by presentation layer
export type { CertState, TraceabilityEvent };
export { JewelryProduct };

export type TraceabilityEventType =
  | 'MineralExtracted'
  | 'TransportStarted'
  | 'LocationUpdated'
  | 'BatchReceived'
  | 'AuthenticityVerified';

const REQUIRED_EVENTS: TraceabilityEventType[] = [
  'MineralExtracted',
  'TransportStarted',
  'LocationUpdated',
  'BatchReceived',
];


@Injectable({ providedIn: 'root' })
export class JewelryStore {
  private readonly api = inject(JewelryApi);
  private readonly iam = inject(IamStore);

  private certSeq = 100;
  private extSeq  = 1;

  readonly certifiedStockSignal = signal<JewelryProduct[]>([]);
  readonly externalStockSignal  = signal<JewelryProduct[]>([]);
  readonly certificatesSignal   = signal<JewelryCertificate[]>([]);
  readonly loadingSignal        = signal<boolean>(false);
  readonly errorSignal          = signal<string | null>(null);

  readonly certifiedStock = this.certifiedStockSignal.asReadonly();
  readonly externalStock  = this.externalStockSignal.asReadonly();
  readonly certificates   = this.certificatesSignal.asReadonly();
  readonly loading        = this.loadingSignal.asReadonly();
  readonly error          = this.errorSignal.asReadonly();

  readonly certifiedCount = computed(() =>
    this.certificatesSignal().filter(c => c.certState === 'CERTIFIED').length
  );
  readonly pendingCount = computed(() =>
    this.certifiedStockSignal().filter(p => p.certState === 'PENDING').length
  );
  readonly rejectedCount = computed(() =>
    this.certifiedStockSignal().filter(p => p.certState === 'REJECTED').length
  );
  readonly totalWeightG = computed(() =>
    this.certifiedStockSignal().reduce((sum, p) => sum + p.weightG, 0)
  );

  readonly totalExternalWeightG = computed(() =>
    this.externalStockSignal().reduce((sum, p) => sum + p.weightG, 0)
  );

  readonly receivedBatches = computed(() =>
    this.certifiedStockSignal().filter(p => !!p.batchId)
  );

  constructor() {
    this.loadProducts();
    this.loadCertificates();
  }

  private loadProducts(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.loadingSignal.set(true);
    this.api.getProductsByUser(userId).pipe(retry(2)).subscribe({
      next: products => {
        const certified = products.filter(p => p.isCertifiedSource);
        const external  = products.filter(p => !p.isCertifiedSource);
        this.certifiedStockSignal.set(certified);
        this.externalStockSignal.set(external);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err?.message ?? 'Error al cargar productos');
        this.loadingSignal.set(false);
      },
    });
  }

  private loadCertificates(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.api.getCertificatesByUser(userId).pipe(retry(2)).subscribe({
      next: certs => this.certificatesSignal.set(certs),
      error: err => this.errorSignal.set(err?.message ?? 'Error al cargar certificados'),
    });
  }

  private static readonly BATCH_ID_FORMAT = /^OT-\d{4}-\d{4}$/;

  receiveMaterial(batchId: string): { success: boolean; error?: string } {
    if (!JewelryStore.BATCH_ID_FORMAT.test(batchId.trim())) {
      return {
        success: false,
        error: 'Formato de ID inválido. Use OT-AAAA-NNNN (ej. OT-2026-0001).',
      };
    }

    // Simulate traceability validation — in a real app the events come from the backend
    const simulatedPresentTypes: TraceabilityEventType[] = [
      'MineralExtracted', 'TransportStarted', 'LocationUpdated', 'BatchReceived',
    ];
    const missing = REQUIRED_EVENTS.filter(t => !simulatedPresentTypes.includes(t));
    if (missing.length > 0) {
      return {
        success: false,
        error: `Trazabilidad incompleta. Faltan eventos: ${missing.join(', ')}`,
      };
    }

    // Blocked batch simulation: batchId ending in 'X'
    if (batchId.endsWith('X')) {
      return {
        success: false,
        error: 'Lote bloqueado por anomalía activa. Resuelva la anomalía antes de recibir.',
      };
    }

    const newProduct = new JewelryProduct({
      id: Date.now(),
      productId: `MAT-${Date.now()}`,
      name: `Material lote ${batchId}`,
      weightG: 100,
      batchId,
      certId: null,
      isCertifiedSource: true,
      certState: 'PENDING',
      isBlocked: false,
      supplier: null,
      events: [],
    });

    this.api.createProduct(newProduct).pipe(retry(2)).subscribe({
      next: created => this.certifiedStockSignal.update(stock => [...stock, created]),
      error: () => this.certifiedStockSignal.update(stock => [...stock, newProduct]),
    });

    return { success: true };
  }

  registerExternalMaterial(data: {
    mineralType: string;
    weightG: number;
    supplier: string;
    ruc?: string;
    entryDate: string;
    invoice?: string;
  }): string {
    const year   = new Date().getFullYear();
    const extId  = `EXT-${year}-${String(this.extSeq++).padStart(4, '0')}`;
    const newProduct = new JewelryProduct({
      id: Date.now(),
      productId: extId,
      name: `${data.mineralType} — ${data.supplier}`,
      weightG: data.weightG,
      batchId: null,
      certId: null,
      isCertifiedSource: false,
      certState: null,
      isBlocked: false,
      supplier: data.supplier,
    });

    this.api.createProduct(newProduct).pipe(retry(2)).subscribe({
      next: created => this.externalStockSignal.update(stock => [...stock, created]),
      error: () => this.externalStockSignal.update(stock => [...stock, newProduct]),
    });

    return extId;
  }

  certifyProduct(productId: string): { success: boolean; certId?: string; error?: string } {
    const product = this.certifiedStockSignal().find(
      p => p.productId === productId || String(p.id) === productId
    );

    if (!product) return { success: false, error: 'Producto no encontrado.' };
    if (!product.isCertifiedSource) {
      return { success: false, error: 'El producto no proviene de fuente certificada.' };
    }
    if (product.isBlocked) {
      return { success: false, error: 'El lote está bloqueado por anomalía activa.' };
    }

    const year   = new Date().getFullYear();
    const certId = `CERT-${year}-${String(this.certSeq++).padStart(4, '0')}`;

    const certificate = new JewelryCertificate({
      id: Date.now(),
      certId,
      productName: product.name,
      certState: 'CERTIFIED',
      signatureValid: true,
      batchId: product.batchId,
      issuedAt: new Date().toISOString(),
      jewelerName: null,
    });

    this.api.createCertificate(certificate).pipe(retry(2)).subscribe({
      next: created => {
        this.certificatesSignal.update(certs => [...certs, created]);
      },
      error: () => {
        this.certificatesSignal.update(certs => [...certs, certificate]);
      },
    });

    const updatedProduct = new JewelryProduct({
      id: product.id,
      productId: product.productId,
      name: product.name,
      weightG: product.weightG,
      batchId: product.batchId,
      certId,
      isCertifiedSource: product.isCertifiedSource,
      certState: 'CERTIFIED',
      isBlocked: product.isBlocked,
      supplier: product.supplier,
    });

    this.api.updateProduct(updatedProduct).pipe(retry(2)).subscribe({
      next: updated => {
        this.certifiedStockSignal.update(stock =>
          stock.map(p => p.productId === productId ? updated : p)
        );
      },
      error: () => {
        this.certifiedStockSignal.update(stock =>
          stock.map(p => p.productId === productId ? updatedProduct : p)
        );
      },
    });

    return { success: true, certId };
  }

  generateCertificate(productId: string): { certId: string } {
    const product = this.certifiedStockSignal().find(
      p => p.productId === productId || String(p.id) === productId
    );
    const year    = new Date().getFullYear();
    const certId  = `CERT-${year}-${String(this.certSeq++).padStart(4, '0')}`;

    const certificate = new JewelryCertificate({
      id: Date.now(),
      certId,
      productName: product?.name ?? 'Producto',
      certState: 'CERTIFIED',
      signatureValid: true,
      batchId: product?.batchId ?? null,
      issuedAt: new Date().toISOString(),
      jewelerName: null,
    });

    this.api.createCertificate(certificate).pipe(retry(2)).subscribe({
      next: created => this.certificatesSignal.update(certs => [...certs, created]),
      error: () => this.certificatesSignal.update(certs => [...certs, certificate]),
    });

    return { certId };
  }

  getInventory(): { certified: JewelryProduct[]; external: JewelryProduct[] } {
    return {
      certified: this.certifiedStockSignal(),
      external:  this.externalStockSignal(),
    };
  }

  createAndCertifyJewelry(data: {
    name: string;
    productType: string;
    material: string;
    sourceBatchId: string;
    weightG: number;
  }): { success: boolean; certId?: string; productId?: string; productName?: string; error?: string } {
    const year      = new Date().getFullYear();
    const productId = `JEW-${year}-${String(this.extSeq++).padStart(4, '0')}`;
    const certId    = `CERT-${year}-${String(this.certSeq++).padStart(4, '0')}`;

    const newProduct = new JewelryProduct({
      id: Date.now(),
      productId,
      name: data.name,
      weightG: data.weightG,
      batchId: data.sourceBatchId,
      certId,
      isCertifiedSource: true,
      certState: 'CERTIFIED',
      isBlocked: false,
      supplier: null,
      events: [],
    });

    const certificate = new JewelryCertificate({
      id: Date.now() + 1,
      certId,
      productName: data.name,
      certState: 'CERTIFIED',
      signatureValid: true,
      batchId: data.sourceBatchId,
      issuedAt: new Date().toISOString(),
      jewelerName: null,
    });

    this.api.createProduct(newProduct).pipe(retry(2)).subscribe({
      next: created => this.certifiedStockSignal.update(s => [...s, created]),
      error: () => this.certifiedStockSignal.update(s => [...s, newProduct]),
    });

    this.api.createCertificate(certificate).pipe(retry(2)).subscribe({
      next: created => this.certificatesSignal.update(c => [...c, created]),
      error: () => this.certificatesSignal.update(c => [...c, certificate]),
    });

    return { success: true, certId, productId, productName: data.name };
  }
}
