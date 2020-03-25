
import {of as observableOf, throwError as observableThrowError, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {catchError, retryWhen, delay, take,  mergeMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SubscriptionSlot, SubscriptionSlotResponse, SubscriptionSlotGeneralResponse } from './subscriptions.interface';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../user/featureflag.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { CategoryResponse } from '../category/category-response.interface';
import { CARS_CATEGORY } from '../item/item-categories';
import { CategoryService } from '../category/category.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const API_URL = 'api/v3/payments';
export const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';
export const SUBSCRIPTIONS_URL = 'bff/subscriptions';

export const SUBSCRIPTIONS_SLOTS_ENDPOINT = 'api/v3/users/me/slots-info';

export const SUBSCRIPTIONS_CATEGORY_ICON_MAP = {
  'car': 'cat_car',
  'helmet': 'cat_motoraccessories',
  'motorbike': 'cat_motorbike'
};

export enum SUBSCRIPTION_TYPES {
  notSubscribed = 1,
  carDealer = 2,
  motorPlan = 3,
  web = 4
}

@Injectable()
export class SubscriptionsService {

  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  public subscriptions: SubscriptionsResponse[];

  constructor(private userService: UserService,
              private featureflagService: FeatureflagService,
              private http: HttpClient,
              private categoryService: CategoryService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ? `${user.firstName} ${user.lastName}` : '';
    });
  }

  public getSlots(): Observable<SubscriptionSlot[]> {
    return this.http.get<SubscriptionSlotGeneralResponse>(`${environment.baseUrl}${SUBSCRIPTIONS_SLOTS_ENDPOINT}`).pipe(
      mergeMap(response => {
        return observableForkJoin(
          response.slots.map(slot => this.mapSlotResponseToSlot(slot))
        );
      }));
  }

  private mapSlotResponseToSlot(slot: SubscriptionSlotResponse): Observable<SubscriptionSlot> {
    return this.categoryService.getCategoryById(slot.category_id)
      .pipe(
        map(category => {
          category.icon_id = SUBSCRIPTIONS_CATEGORY_ICON_MAP[category.icon_id];
          const mappedSlot: SubscriptionSlot = {
            category,
            available: slot.available,
            limit: slot.limit
          };

          return mappedSlot;
        })
      );
  }

  public getUserSubscriptionType(): Observable<number> {
    return observableForkJoin([
      this.userService.isProfessional(),
      this.getSubscriptions(false),
      this.userService.getMotorPlan()
    ]).pipe(
    map(values => {
      if (values[0]) {
        return SUBSCRIPTION_TYPES.carDealer;
      }

      const carsSubscription = values[1].find(subscription => subscription.category_id === parseInt(CARS_CATEGORY, 10));

      if (carsSubscription) {
        if (values[2].type === 'motor_plan_pro' && !carsSubscription.selected_tier_id) {
          return SUBSCRIPTION_TYPES.motorPlan;
        }

        if (carsSubscription.selected_tier_id) {
          return SUBSCRIPTION_TYPES.web;
        }
      }

      return SUBSCRIPTION_TYPES.notSubscribed;
    }));
  }

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
      },
      {
        observe: 'response' as 'body'
      }
    );
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get<any>(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`).pipe(
      retryWhen((errors) => {
        return errors.pipe(
          mergeMap((error) => (error.status !== 404) ? observableThrowError(error) : observableOf(error)),
          delay(1000),
          take(10),);
      }));
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`, {
      invoice_id: invoiceId,
      payment_method_id: paymentId,
    }, { observe: 'response' as 'body' });
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`);
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS);
  }

  public getSubscriptions(cache: boolean = true): Observable<SubscriptionsResponse[]> {
    if (this.subscriptions && cache) {
      return observableOf(this.subscriptions);
    }

    return this.categoryService.getCategories()
    .pipe(
      mergeMap((categories) => {
        return this.http.get(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).pipe(
        catchError((error) => {
          return observableOf(error);
        }))
        .pipe(
          map((subscriptions: SubscriptionsResponse[]) => {
            if (subscriptions.length > 0) {
              return subscriptions.map((subscription: SubscriptionsResponse) => this.mapSubscriptions(subscription, categories))
            }
          })
        );
      })
    )
  }

  public cancelSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/cancel/${planId}`,
      null, { observe: 'response' as 'body' });
  }

  public continueSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/unsubscription/cancel/${planId}`,
      null, { observe: 'response' as 'body' });
  }

  public editSubscription(subscription: SubscriptionsResponse, newPlanId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${subscription.id}`, { plan_id: newPlanId }, { observe: 'response' as 'body' });
  }

  private mapSubscriptions(subscription: SubscriptionsResponse, categories: CategoryResponse[]): SubscriptionsResponse {
    let category = categories.find((category: CategoryResponse) => subscription.category_id === category.category_id);
    
    if (!category && subscription.category_id === 0) {
      category = this.categoryService.getConsumerGoodsCategory();
    }
    
    if (category) {
      subscription.category_name = category.name;
      subscription.category_icon = category.icon_id;
      subscription.selected_tier = this.getSelectedTier(subscription);
    }
    return subscription;
  }

  private getSelectedTier(subscription: SubscriptionsResponse): Tier {
    const selectedTier = subscription.selected_tier_id ? subscription.tiers.filter(tier => tier.id === subscription.selected_tier_id) : subscription.tiers.filter(tier => tier.id === subscription.default_tier_id);
    return selectedTier[0];
  }
}
