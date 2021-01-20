import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item, ITEM_TYPES } from '@core/item/item';
import {
  ItemResponse,
  ItemContent,
  CarContent,
  RealestateContent,
} from '@core/item/item-response.interface';
import { Realestate } from '@core/item/realestate';
import { UuidService } from '@core/uuid/uuid.service';

@Injectable()
export class MapItemService {
  constructor(private uuidService: UuidService) {}

  public mapItems(items: ItemResponse[]): Item[] {
    return items.map((itemResponse: ItemResponse) => {
      return this.mapAnyItem(itemResponse);
    });
  }

  public mapAnyItem(item: ItemResponse): Item {
    const content: ItemContent = item.content;
    if (item.type === 'cars') {
      return this.mapCar(content);
    } else if (item.type === 'real_estate') {
      return this.mapRealEstate(content);
    }
    return this.mapItem(content);
  }

  private mapCar(content: CarContent): Car {
    return new Car(
      content.id,
      content.user.id,
      content.title,
      content.storytelling,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      content.sale_conditions,
      content.images,
      content.web_slug,
      content.brand,
      content.model,
      content.year,
      content.gearbox,
      content.engine,
      content.color,
      content.horsepower,
      content.body_type,
      content.num_doors,
      content.extras,
      content.warranty,
      content.num_seats,
      content.condition,
      content.version,
      content.financed_price,
      content.publish_date,
      content.image,
      content.km
    );
  }

  private mapRealEstate(content: RealestateContent): Realestate {
    return new Realestate(
      content.id,
      content.user.id,
      content.title,
      content.storytelling,
      content.location,
      content.sale_price,
      content.currency_code,
      content.modified_date,
      content.url,
      content.flags,
      content.images,
      content.web_slug,
      content.operation,
      content.type,
      content.condition,
      content.surface,
      content.bathrooms,
      content.rooms,
      content.garage,
      content.terrace,
      content.elevator,
      content.pool,
      content.garden,
      content.image,
      content.publish_date
    );
  }

  private mapItem(content: ItemContent): Item {
    return new Item(
      content.id,
      null,
      content.user.id,
      content.title,
      content.description,
      content.category_id,
      null,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      null,
      content.sale_conditions,
      content.images
        ? content.images[0]
        : {
            id: this.uuidService.getUUID(),
            original_width: content.image ? content.image.original_width : null,
            original_height: content.image
              ? content.image.original_height
              : null,
            average_hex_color: '',
            urls_by_size: content.image,
          },
      content.images,
      content.web_slug,
      content.publish_date,
      content.delivery_info,
      ITEM_TYPES.CONSUMER_GOODS,
      content.extra_info
        ? {
            object_type: {
              id:
                content.extra_info.object_type &&
                content.extra_info.object_type.id
                  ? content.extra_info.object_type.id.toString()
                  : null,
              name:
                content.extra_info.object_type &&
                content.extra_info.object_type.name
                  ? content.extra_info.object_type.name
                  : null,
            },
            brand: content.extra_info.brand,
            model: content.extra_info.model,
            gender: content.extra_info.gender,
            size: {
              id:
                content.extra_info.size && content.extra_info.size.id
                  ? content.extra_info.size.id.toString()
                  : null,
            },
            condition: content.extra_info.condition || null,
          }
        : undefined
    );
  }
}
