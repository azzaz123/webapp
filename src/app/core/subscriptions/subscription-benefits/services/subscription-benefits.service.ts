import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { subscriptionBenefits } from '../constants/subscription-benefits';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

@Injectable()
export class SubscriptionBenefitsService {
  private subscriptionBenefits: SubscriptionBenefit[];

  constructor() {}

  public getSubscriptionBenefits(useCache = true): Observable<SubscriptionBenefit[]> {
    if (useCache && this.subscriptionBenefits) {
      return of(this.subscriptionBenefits);
    }
    return of(subscriptionBenefits).pipe(tap((response) => (this.subscriptionBenefits = response)));
  }
}
