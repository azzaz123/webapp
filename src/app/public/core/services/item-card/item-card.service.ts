import { Injectable } from '@angular/core';
import { Item } from '@core/item/item';
import { MarkAsFavouriteBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { Observable } from 'rxjs';

@Injectable()
export class ItemCardService {
  constructor(private itemApiService: ItemApiService) {}

  public toggleFavourite(item: Item): void {
    item.flags.favorite = !item.flags.favorite;

    (item.flags.favorite
      ? this.markAsFavourite(item.id)
      : this.unmarkAsFavourite(item.id)
    ).subscribe({
      next: () => {
        item.flags.favorite = !item.flags.favorite;
      },
    });
  }

  private markAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.markAsFavourite(id);
  }

  private unmarkAsFavourite(
    id: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.unmarkAsFavourite(id);
  }
}
