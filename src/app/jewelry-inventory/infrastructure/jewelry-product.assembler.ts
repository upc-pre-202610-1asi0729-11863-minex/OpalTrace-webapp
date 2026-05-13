import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { JewelryProduct } from '../domain/model/jewelry-product.entity';
import { JewelryProductResource, JewelryProductsResponse } from './jewelry-product.resource';

export class JewelryProductAssembler
  implements BaseAssembler<JewelryProduct, JewelryProductResource, JewelryProductsResponse> {

  toEntityFromResource(resource: JewelryProductResource): JewelryProduct {
    return new JewelryProduct({
      id: resource.id,
      productId: resource.productId,
      name: resource.name,
      weightG: resource.weightG,
      batchId: resource.batchId,
      certId: resource.certId,
      isCertifiedSource: resource.isCertifiedSource,
      certState: resource.certState,
      isBlocked: resource.isBlocked,
      supplier: resource.supplier,
      events: resource.events ?? [],
    });
  }

  toResourceFromEntity(entity: JewelryProduct): JewelryProductResource {
    return {
      id: entity.id,
      productId: entity.productId,
      name: entity.name,
      weightG: entity.weightG,
      batchId: entity.batchId,
      certId: entity.certId,
      isCertifiedSource: entity.isCertifiedSource,
      certState: entity.certState,
      isBlocked: entity.isBlocked,
      supplier: entity.supplier,
      events: entity.events,
    };
  }

  toEntitiesFromResponse(response: JewelryProductsResponse): JewelryProduct[] {
    return response.products.map(r => this.toEntityFromResource(r));
  }
}
