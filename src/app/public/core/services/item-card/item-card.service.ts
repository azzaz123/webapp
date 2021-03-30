import { Injectable } from '@angular/core';
import { MarkAsFavouriteBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';
import { Observable } from 'rxjs';

@Injectable()
export class ItemCardService {
  constructor(private itemApiService: ItemApiService) {}

  public toggleFavourite(item: ItemCard): void {
    item.flags.favorite = !item.flags.favorite;

    (item.flags.favorite ? this.markAsFavourite(item.id) : this.unmarkAsFavourite(item.id)).subscribe({
      error: () => {
        item.flags.favorite = !item.flags.favorite;
      },
    });
  }

  private markAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.markAsFavourite(id);
  }

  private unmarkAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.unmarkAsFavourite(id);
  }
}
