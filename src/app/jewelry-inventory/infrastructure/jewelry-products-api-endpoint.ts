import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { JewelryProduct } from '../domain/model/jewelry-product.entity';
import { JewelryProductResource, JewelryProductsResponse } from './jewelry-product.resource';
import { JewelryProductAssembler } from './jewelry-product.assembler';
import { environment } from '../../../environments/environment';

export class JewelryProductsApiEndpoint extends BaseApiEndpoint<
  JewelryProduct,
  JewelryProductResource,
  JewelryProductsResponse,
  JewelryProductAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderJewelryProductsEndpointPath}`,
      new JewelryProductAssembler()
    );
  }

  getByUserId(_userId: number): Observable<JewelryProduct[]> {
    return this.http.get<JewelryProductResource[]>(this.endpointUrl).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch jewelry products'))
    );
  }
}
