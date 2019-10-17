import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionSlot, SubscriptionSlotResponse } from './subscriptions.interface';
import { CategoryService } from '../category/category.service';
import { HttpServiceNew } from '../http/http.service.new';

export const SUBSCRIPTIONS_SLOTS_ENDPOINT = 'subscriptions/slots/';

export const SUBSCRIPTIONS_CATEGORY_ICON_MAP = {
  'car': 'cat_car',
  'helmet': 'cat_motoraccessories',
  'motorbike': 'cat_motorbike'
};

@Injectable()
export class SubscriptionsService {

  constructor(
    private http: HttpServiceNew,
    private categoryService: CategoryService) {
  }

  public getSlots(): Observable<SubscriptionSlot[]> {
    return this.http.get(SUBSCRIPTIONS_SLOTS_ENDPOINT)
      .flatMap(slots => {
        return Observable.forkJoin(
          slots.map(s => this.mapSlotResponseToSlot(s))
        );
      });
  }

  private mapSlotResponseToSlot(slot: SubscriptionSlotResponse): Observable<SubscriptionSlot> {
    return this.categoryService.getCategoryById(slot.category_id)
      .map(category => {
        category.icon_id = SUBSCRIPTIONS_CATEGORY_ICON_MAP[category.icon_id];
        const mappedSlot: SubscriptionSlot = {
          category,
          available: slot.available,
          limit: slot.limit
        };

        return mappedSlot;
      });
  }
}
