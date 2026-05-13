import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { JewelryProduct } from '../domain/model/jewelry-product.entity';
import { JewelryCertificate } from '../domain/model/jewelry-certificate.entity';
import { JewelryProductsApiEndpoint } from './jewelry-products-api-endpoint';
import { JewelryCertificatesApiEndpoint } from './jewelry-certificates-api-endpoint';

@Injectable({ providedIn: 'root' })
export class JewelryApi extends BaseApi {
  private readonly productsEndpoint: JewelryProductsApiEndpoint;
  private readonly certificatesEndpoint: JewelryCertificatesApiEndpoint;

  constructor(private http: HttpClient) {
    super();
    this.productsEndpoint = new JewelryProductsApiEndpoint(http);
    this.certificatesEndpoint = new JewelryCertificatesApiEndpoint(http);
  }

  getProductsByUser(userId: number): Observable<JewelryProduct[]> {
    return this.productsEndpoint.getByUserId(userId);
  }

  getProduct(id: number): Observable<JewelryProduct> {
    return this.productsEndpoint.getById(id);
  }

  createProduct(product: JewelryProduct): Observable<JewelryProduct> {
    return this.productsEndpoint.create(product);
  }

  updateProduct(product: JewelryProduct): Observable<JewelryProduct> {
    return this.productsEndpoint.update(product, product.id);
  }

  getCertificatesByUser(userId: number): Observable<JewelryCertificate[]> {
    return this.certificatesEndpoint.getByUserId(userId);
  }

  createCertificate(certificate: JewelryCertificate): Observable<JewelryCertificate> {
    return this.certificatesEndpoint.create(certificate);
  }
}
