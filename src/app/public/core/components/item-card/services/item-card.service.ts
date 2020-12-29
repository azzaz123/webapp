import { Injectable } from '@angular/core';
import { MarkAsFavouriteBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.module';
import { Observable } from 'rxjs';

@Injectable()
export class ItemCardService {
  constructor(private itemApiService: ItemApiService) {}

  public markAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.markAsFavourite(id);
  }

  public unmarkAsFavourite(
    id: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.unmarkAsFavourite(id);
  }
}
