import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubscriptionSlot } from './subscriptions.interface';
import { CategoryService } from '../category/category.service';
import { HttpServiceNew } from '../http/http.service.new';

export const SUBSCRIPTIONS_SLOTS_ENDPOINT = 'assets/json/mock-subscriptions-slots.json';

@Injectable()
export class SubscriptionsService {

  constructor(
    private http: HttpServiceNew,
    private categoryService: CategoryService) {
  }

  public getSlots(): Observable<SubscriptionSlot[]> {
    return this.http.getNoBase<SubscriptionSlot[]>(SUBSCRIPTIONS_SLOTS_ENDPOINT)
      .flatMap(slots => {
        return Observable.forkJoin(
          slots.map(s => this.getSlotCategory(s))
        );
      });
  }

  private getSlotCategory(slot: SubscriptionSlot) {
    return this.categoryService.getCategoryById(slot.category_id)
      .map(category => {
        slot.category = category;
        return slot;
      });
  }
}
