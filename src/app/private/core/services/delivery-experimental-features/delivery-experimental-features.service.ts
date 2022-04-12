import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const DELIVERY_EXPERIMENTAL_FEATURES_KEY = 'deliveryExperimentalFeatures';

@Injectable()
export class DeliveryExperimentalFeaturesService {
  constructor() {}

  public get featuresEnabled$(): Observable<boolean> {
    const deliveryFeaturesEnabled = !!localStorage.getItem(DELIVERY_EXPERIMENTAL_FEATURES_KEY);

    // In case we want to segment by user ID:

    // return combineLatest([of(deliveryFeaturesEnabled), this.userService.user$]).pipe(
    //   map(([deliveryFeaturesEnabled, user]: [boolean, User]) => [deliveryFeaturesEnabled, parseInt(user.id.slice(-1))]),
    //   map(([deliveryFeaturesEnabled, userId]: [boolean, number]) => deliveryFeaturesEnabled || userId % 2 === 0)
    // );

    return combineLatest([of(deliveryFeaturesEnabled)]).pipe(map(([deliveryFeaturesEnabled]) => deliveryFeaturesEnabled));
  }
}
