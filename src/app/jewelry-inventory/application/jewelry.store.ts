import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { retry } from 'rxjs/operators';
import { IamStore } from '../../iam/application/iam.store';
import { JewelryApi } from '../infrastructure/jewelry-api';
import { JewelryProduct, CertState, TraceabilityEvent } from '../domain/model/jewelry-product.entity';
import { JewelryCertificate } from '../domain/model/jewelry-certificate.entity';
import { LocalPersistence } from '../../shared/infrastructure/local-persistence';

interface JewelryProductProps {
  id: number; productId: string; name: string; weightG: number;
  batchId: string | null; certId: string | null; isCertifiedSource: boolean;
  certState: CertState; isBlocked: boolean; supplier: string | null; events: TraceabilityEvent[];
}

interface JewelryCertificateProps {
  id: number; certId: string; productName: string; certState: 'CERTIFIED' | 'REVOKED';
  signatureValid: boolean; batchId: string | null; issuedAt: string; jewelerName: string | null;
}

// Re-export domain types consumed by presentation layer
export type { CertState, TraceabilityEvent };
export { JewelryProduct };


@Injectable({ providedIn: 'root' })
export class JewelryStore {
  private readonly api = inject(JewelryApi);
  private readonly iam = inject(IamStore);
  private readonly persistence = inject(LocalPersistence);

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
    this.certifiedStockSignal().filter(p => !!p.batchId && p.certState !== 'CERTIFIED')
  );

  constructor() {
    this.hydrateFromCache();
    this.loadProducts();
    this.loadCertificates();
    effect(() => {
      this.persistence.write<JewelryProductProps>('jewelry-certified', this.certifiedStockSignal().map(p => this.productToProps(p)));
      this.persistence.write<JewelryProductProps>('jewelry-external',  this.externalStockSignal().map(p => this.productToProps(p)));
      this.persistence.write<JewelryCertificateProps>('jewelry-certs', this.certificatesSignal().map(c => this.certToProps(c)));
    });
  }

  private productToProps(p: JewelryProduct): JewelryProductProps {
    return {
      id: p.id, productId: p.productId, name: p.name, weightG: p.weightG,
      batchId: p.batchId, certId: p.certId, isCertifiedSource: p.isCertifiedSource,
      certState: p.certState, isBlocked: p.isBlocked, supplier: p.supplier, events: p.events,
    };
  }

  private certToProps(c: JewelryCertificate): JewelryCertificateProps {
    return {
      id: c.id, certId: c.certId, productName: c.productName, certState: c.certState,
      signatureValid: c.signatureValid, batchId: c.batchId, issuedAt: c.issuedAt, jewelerName: c.jewelerName,
    };
  }

  private hydrateFromCache(): void {
    const certified = this.persistence.read<JewelryProductProps>('jewelry-certified');
    const external  = this.persistence.read<JewelryProductProps>('jewelry-external');
    const certs     = this.persistence.read<JewelryCertificateProps>('jewelry-certs');
    if (certified.length > 0) this.certifiedStockSignal.set(certified.map(p => new JewelryProduct(p)));
    if (external.length > 0)  this.externalStockSignal.set(external.map(p => new JewelryProduct(p)));
    if (certs.length > 0)     this.certificatesSignal.set(certs.map(c => new JewelryCertificate(c)));
  }

  private loadProducts(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.loadingSignal.set(true);
    this.api.getProductsByUser(userId).pipe(retry(2)).subscribe({
      next: products => {
        if (products.length > 0) {
          const certified = products.filter(p => p.isCertifiedSource);
          const external  = products.filter(p => !p.isCertifiedSource);
          this.certifiedStockSignal.update(cached => this.mergeProducts(cached, certified));
          this.externalStockSignal.update(cached => this.mergeProducts(cached, external));
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err?.message ?? 'Error al cargar productos');
        this.loadingSignal.set(false);
      },
    });
  }

  private mergeProducts(cached: JewelryProduct[], incoming: JewelryProduct[]): JewelryProduct[] {
    const byProductId = new Map(cached.map(p => [p.productId, p]));
    incoming.forEach(p => byProductId.set(p.productId, p));
    return Array.from(byProductId.values());
  }

  private loadCertificates(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.api.getCertificatesByUser(userId).pipe(retry(2)).subscribe({
      next: certs => {
        if (certs.length > 0) {
          this.certificatesSignal.update(cached => {
            const byCertId = new Map(cached.map(c => [c.certId, c]));
            certs.forEach(c => byCertId.set(c.certId, c));
            return Array.from(byCertId.values());
          });
        }
      },
      error: err => this.errorSignal.set(err?.message ?? 'Error al cargar certificados'),
    });
  }

  private static readonly BATCH_ID_FORMAT = /^OT-\d{4}-\d{4}$/;

  receiveMaterial(batchId: string): { success: boolean; errorKey?: string; errorParams?: Record<string, string> } {
    const normalizedId = batchId.trim();

    if (!JewelryStore.BATCH_ID_FORMAT.test(normalizedId)) {
      return { success: false, errorKey: 'receive.err-format' };
    }

    const alreadyReceived = this.certifiedStockSignal().some(p => p.batchId === normalizedId);
    if (alreadyReceived) {
      return { success: false, errorKey: 'receive.err-duplicate', errorParams: { batchId: normalizedId } };
    }

    const newProduct = new JewelryProduct({
      id: Date.now(),
      productId: `MAT-${Date.now()}`,
      name: `Material lote ${normalizedId}`,
      weightG: 100,
      batchId: normalizedId,
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

    const issuedAt = new Date().toISOString();

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

    try {
      const registry = JSON.parse(localStorage.getItem('ot_certs') ?? '{}');
      registry[certId] = {
        productName: data.name,
        issuedAt,
        batchId: data.sourceBatchId,
        points: this.buildTraceabilityPoints(data.sourceBatchId, issuedAt),
      };
      localStorage.setItem('ot_certs', JSON.stringify(registry));
    } catch { /* ignore storage errors */ }

    const certificate = new JewelryCertificate({
      id: Date.now() + 1,
      certId,
      productName: data.name,
      certState: 'CERTIFIED',
      signatureValid: true,
      batchId: data.sourceBatchId,
      issuedAt,
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

  /**
   * Builds the standard mineral-to-jewelry traceability chain for a freshly
   * issued certificate, anchored to the certification date. Coordinates follow
   * the Andes → Lima route used across the OpalTrace verification map.
   */
  private buildTraceabilityPoints(batchId: string, issuedAt: string) {
    const base = new Date(issuedAt).getTime();
    const day  = 24 * 60 * 60 * 1000;
    const hash = (n: number) => `0x${(base + n).toString(16).slice(-10)}`;
    return [
      { latitude: -13.5328, longitude: -72.4442, eventType: 'MineralExtracted', timestamp: new Date(base - 5 * day).toISOString(), actorName: `Origen minero · ${batchId}`, blockchainTxHash: hash(1) },
      { latitude: -13.6012, longitude: -72.5110, eventType: 'TransportStarted', timestamp: new Date(base - 4 * day).toISOString(), actorName: 'Cadena de custodia',            blockchainTxHash: hash(2) },
      { latitude: -12.0800, longitude: -77.0500, eventType: 'BatchReceived',    timestamp: new Date(base - 2 * day).toISOString(), actorName: 'Refinería',                     blockchainTxHash: hash(3) },
      { latitude: -12.0464, longitude: -77.0300, eventType: 'CertificateIssued', timestamp: issuedAt,                              actorName: 'Joyería',                      blockchainTxHash: hash(4) },
    ];
  }
}
