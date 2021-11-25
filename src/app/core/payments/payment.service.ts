import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  BillingInfoResponse,
  CreditInfo,
  OrderProExtras,
  PackResponse,
  Packs,
  PerkResponse,
  ProductResponse,
  Products,
  ScheduledStatus,
  PaymentIntents,
} from './payment.interface';
import { mapValues, values, keyBy, groupBy, min } from 'lodash-es';
import { CREDITS_FACTOR, CREDITS_PACK_ID, Pack, PACKS_TYPES } from './pack';
import { PerksModel } from './payment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, flatMap } from 'rxjs/operators';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';

export enum PAYMENT_METHOD {
  STRIPE = 'STRIPE',
}
export enum PAYMENT_RESPONSE_STATUS {
  SUCCEEDED = 'SUCCEEDED',
  REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  FAILED = 'FAILED',
}

export const PAYMENTS_API_URL = 'api/v3/payments';
export const PROTOOL_API_URL = 'api/v3/protool';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private products: Products;
  private perksModel: PerksModel;
  private billingInfo: BillingInfoResponse;

  constructor(private http: HttpClient) {}

  public getBillingInfo(cache: boolean = true): Observable<BillingInfoResponse> {
    if (cache && this.billingInfo) {
      return of(this.billingInfo);
    }

    return this.http.get<BillingInfoResponse>(`${environment.baseUrl}${PAYMENTS_API_URL}/billing-info/me`).pipe(
      map((billingInfo: BillingInfoResponse) => {
        this.billingInfo = billingInfo;
        return this.billingInfo;
      })
    );
  }

  public updateBillingInfo(data: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}${PAYMENTS_API_URL}/billing-info`, data);
  }

  public paymentIntents(orderId: string, paymentId: string): Observable<PaymentIntents> {
    return this.http.post<PaymentIntents>(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_intents/${paymentId}`, {
      order_id: orderId,
    });
  }

  public paymentIntentsConfirm(orderId: string, paymentId: string, paymentMethodId: string): Observable<PaymentIntents> {
    return this.http.post<PaymentIntents>(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_intents/${paymentId}/confirm`, {
      order_id: orderId,
      payment_method_id: paymentMethodId,
    });
  }

  public getPacks(product?: Products): Observable<Packs> {
    let params: any;
    if (product) {
      params = {
        products: Object.keys(product)[0],
      };
    }
    return this.http.get(`${environment.baseUrl}${PAYMENTS_API_URL}/packs`, { params }).pipe(
      flatMap((packs: PackResponse[]) => {
        const sortedPacks = this.sortPacksByQuantity(packs);
        return this.preparePacks(sortedPacks, product);
      })
    );
  }

  public getCreditInfo(cache: boolean = true): Observable<CreditInfo> {
    return this.getPerks(cache).pipe(
      map((perks: PerksModel) => {
        const currencyName: string = 'wallacredits';
        const factor: number = CREDITS_FACTOR;
        return {
          currencyName,
          credit: perks[currencyName].quantity,
          factor,
        };
      })
    );
  }

  public getCreditsPacks(): Observable<Pack[]> {
    const product: Products = {
      [CREDITS_PACK_ID]: {
        id: CREDITS_PACK_ID,
        name: 'WALLACREDITS',
      },
    };
    return this.getPacks(product).pipe(
      map((packs: Packs) => {
        return packs.wallacredits;
      })
    );
  }

  public getSubscriptionPacks(): Observable<Packs> {
    return this.http.get(`${environment.baseUrl}${PAYMENTS_API_URL}/subscription/packs`).pipe(
      flatMap((packs: PackResponse[]) => {
        const sortedPacks = this.sortPacksByQuantity(packs);
        return this.preparePacks(sortedPacks);
      })
    );
  }

  public orderExtrasProPack(order: OrderProExtras): Observable<any> {
    return this.http.post(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/pack-order/create`, order);
  }

  public getPerks(cache: boolean = true): Observable<PerksModel> {
    if (cache && this.perksModel) {
      return of(this.perksModel);
    }
    const response = new PerksModel();

    return this.http.get(`${environment.baseUrl}${PAYMENTS_API_URL}/perks/me`).pipe(
      flatMap((perks: PerkResponse[]) => {
        return this.getProducts().pipe(
          map((products: Products) => {
            perks.forEach((perk: PerkResponse) => {
              if (products[perk.product_id] !== null || products[perk.product_id] !== undefined) {
                const name: string = products[perk.product_id].name;
                if (name === 'NATIONAL_BUMP') {
                  if (perk.subscription_id !== null) {
                    response.setNationalSubscription(perk);
                  } else {
                    response.setNationalExtra(perk);
                  }
                } else if (name === 'BUMP') {
                  if (perk.subscription_id !== null) {
                    response.setBumpSubscription(perk);
                  } else {
                    response.setBumpExtra(perk);
                  }
                } else if (name === 'LISTINGS') {
                  if (perk.subscription_id !== null) {
                    response.setListingSubscription(perk);
                  }
                } else if (name === 'WALLACOINS') {
                  response.setWallacoins(perk);
                } else if (name === 'WALLACREDITS') {
                  response.setWallacredits(perk);
                }
              }
            });
            this.perksModel = response;
            return response;
          }),
          catchError(() => of(response))
        );
      })
    );
  }

  public getStatus(): Observable<ScheduledStatus> {
    return this.http.get<ScheduledStatus>(`${environment.baseUrl}${PROTOOL_API_URL}/status`);
  }

  public deleteBillingInfo(billingInfoId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${PAYMENTS_API_URL}/billing-info/${billingInfoId}`);
  }

  public deleteCache() {
    this.perksModel = null;
  }

  private preparePacks(sortedPacks, product?: Products) {
    const packsResponse: Packs = {
      cityBump: [],
      countryBump: [],
      listings: [],
      wallacoins: [],
      wallacredits: [],
    };
    return (product ? of(product) : this.getProducts()).pipe(
      map((products: Products) => {
        const valuesVar = groupBy(sortedPacks, (pack) => {
          return Object.keys(pack.benefits)[0];
        });
        const mins = mapValues(valuesVar, (packsArray) => {
          return min(
            packsArray.map((pack) => {
              return values(pack.benefits)[0];
            })
          );
        });
        sortedPacks.forEach((pack: PackResponse) => {
          const benefitsId: string = Object.keys(pack.benefits)[0];
          const name: string = PACKS_TYPES[products[benefitsId].name] ? PACKS_TYPES[products[benefitsId].name] : '';
          const baseQuantity = mins[benefitsId];
          const responsePrice: number =
            packsResponse[name][0] === null || packsResponse[name][0] === undefined ? +pack.price : packsResponse[name][0].price;
          const basePrice: number = (pack.benefits[benefitsId] === baseQuantity ? +pack.price : responsePrice) / baseQuantity;
          const formattedPack: Pack = new Pack(pack.id, pack.benefits[benefitsId], +pack.price, pack.currency, name);
          if (pack.original_price) {
            formattedPack.calculateDiscountWithOriginalPrice(+pack.price, +pack.original_price);
          } else {
            formattedPack.calculateDiscount(pack.price, pack.benefits[benefitsId], basePrice);
          }

          if (products[benefitsId].name === 'NATIONAL_BUMP') {
            packsResponse.countryBump.push(formattedPack);
          } else if (products[benefitsId].name === 'BUMP') {
            packsResponse.cityBump.push(formattedPack);
          } else if (products[benefitsId].name === 'LISTINGS') {
            packsResponse.listings.push(formattedPack);
          } else if (products[benefitsId].name === 'WALLACOINS') {
            packsResponse.wallacoins.push(formattedPack);
          } else if (products[benefitsId].name === 'WALLACREDITS') {
            packsResponse.wallacredits.push(formattedPack);
          }
        });
        return packsResponse;
      })
    );
  }

  private sortPacksByQuantity(packs: PackResponse[]): PackResponse[] {
    const sortedPacks = packs.sort(function (a, b) {
      const quantityA: any = values(a.benefits)[0];
      const quantityB: any = values(b.benefits)[0];
      return quantityA - quantityB;
    });
    return sortedPacks;
  }

  private getProducts(): Observable<Products> {
    if (this.products) {
      return of(this.products);
    }
    return this.http.get(`${environment.baseUrl}${PAYMENTS_API_URL}/products`).pipe(
      map((products: ProductResponse[]) => {
        this.products = keyBy(products, 'id');
        return this.products;
      })
    );
  }
}
