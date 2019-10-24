import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, RequestOptions, Response } from '@angular/http';
import {
  BillingInfoResponse, CreditInfo,
  FinancialCard,
  OrderProExtras,
  PackResponse,
  Packs,
  PerkResponse,
  ProductResponse,
  Products,
  SabadellInfoResponse,
  ScheduledStatus, PaymentIntents
} from './payment.interface';
import { HttpService } from '../http/http.service';
import { reduce, mapValues, values, keyBy, groupBy, min } from 'lodash-es';
import { COINS_FACTOR, COINS_PACK_ID, CREDITS_FACTOR, CREDITS_PACK_ID, Pack, PACKS_TYPES } from './pack';
import { PerksModel } from './payment.model';
import { UserService } from '../user/user.service';
import { PERMISSIONS } from '../user/user';

@Injectable()
export class PaymentService {

  private API_URL = 'api/v3/payments';
  private API_URL_PROTOOL = 'api/v3/protool';
  private products: Products;
  private perksModel: PerksModel;

  constructor(private http: HttpService,
              private userService: UserService) {
  }

  public getFinancialCard(): Observable<FinancialCard> {
    return this.http.get(this.API_URL + '/c2b/financial-card')
      .map((r: Response) => r.json());
  }

  public deleteFinancialCard(): Observable<any> {
    return this.http.delete(this.API_URL + '/c2b/financial-card');
  }

  public getSabadellInfo(orderId: string): Observable<SabadellInfoResponse> {
    return this.http.get(this.API_URL + '/c2b/sabadell/tpv/params', {
      orderId: orderId
    })
      .map((r: Response) => r.json());
  }

  public getBillingInfo(): Observable<BillingInfoResponse> {
    return this.http.get(this.API_URL + '/billing-info/me')
      .map((r: Response) => r.json());
  }

  public updateBillingInfo(data: any): Observable<any> {
    return this.http.put(this.API_URL + '/billing-info', data);
  }

  public pay(orderId: string): Observable<any> {
    return this.http.post(this.API_URL + '/c2b/sabadell/tpv/pay', {
      order_id: orderId
    });
  }

  public paymentIntents(orderId: string, paymentId: string): Observable<PaymentIntents> {
    return this.http.post(`${this.API_URL}/c2b/stripe/payment_intents/${paymentId}`, {
      order_id: orderId
    })
      .map((r: Response) => r.json());
  }

  public paymentIntentsConfirm(orderId: string, paymentId: string, paymentMethodId: string): Observable<PaymentIntents> {
    return this.http.post(`${this.API_URL}/c2b/stripe/payment_intents/${paymentId}/confirm`, {
      order_id: orderId,
      payment_method_id: paymentMethodId
    })
      .map((r: Response) => r.json());
  }

  public getPacks(product?: Products): Observable<Packs> {
    let params: any;
    if (product) {
      params = {
        products: Object.keys(product)[0]
      };
    }
    return this.http.get(this.API_URL + '/packs', params)
      .map((r: Response) => r.json())
      .flatMap((packs: PackResponse[]) => {
          const sortedPacks = this.sortPacksByQuantity(packs);
          return this.preparePacks(sortedPacks, product);
        }
      );
  }

  public getCreditInfo(cache: boolean = true): Observable<CreditInfo> {
    return this.userService.hasPerm(PERMISSIONS.coins)
      .flatMap((hasPerm: boolean) => {
        return this.getPerks(cache)
          .map((perks: PerksModel) => {
            const currencyName: string = hasPerm ? 'wallacoins' : 'wallacredits';
            const factor: number = hasPerm ? COINS_FACTOR : CREDITS_FACTOR;
            return {
              currencyName: currencyName,
              credit: perks[currencyName].quantity,
              factor: factor
            }
          });
      });
  }

  public getCoinsCreditsPacks(): Observable<Pack[]> {
    return this.userService.hasPerm('coins')
      .flatMap((isActive: boolean) => {
        return isActive ? this.getCoinsPacks() : this.getCreditsPacks();
      });
  }

  public getCoinsPacks(): Observable<Pack[]> {
    const product: Products = {
      [COINS_PACK_ID]: {
        id: COINS_PACK_ID,
        name: 'WALLACOINS'
      }
    };
    return this.getPacks(product)
      .map((packs: Packs) => {
        return packs.wallacoins;
      });
  }

  public getCreditsPacks(): Observable<Pack[]> {
    const product: Products = {
      [CREDITS_PACK_ID]: {
        id: CREDITS_PACK_ID,
        name: 'WALLACREDITS'
      }
    };
    return this.getPacks(product)
      .map((packs: Packs) => {
        return packs.wallacredits;
      });
  }

  private chunkArray(array, chunkSize): Pack[][] {
    return reduce(array, function (result, val) {
      const lastChunk = result[result.length - 1];
      if (lastChunk.length < chunkSize) lastChunk.push(val);
      else result.push([val]);
      return result;
    }, [[]]);
  }

  public getSubscriptionPacks(): Observable<Packs> {
    return this.http.get(this.API_URL + '/subscription/packs')
      .map((r: Response) => r.json())
      .flatMap((packs: PackResponse[]) => {
        const sortedPacks = this.sortPacksByQuantity(packs);
        return this.preparePacks(sortedPacks);
      });
  }

  public orderExtrasProPack(order: OrderProExtras): Observable<any> {
    return this.http.post(this.API_URL + '/c2b/pack-order/create', order);
  }

  public getPerks(cache: boolean = true): Observable<PerksModel> {
    if (cache && this.perksModel) {
      return Observable.of(this.perksModel);
    }
    const response = new PerksModel();

    return this.http.get(this.API_URL + '/perks/me')
      .map((r: Response) => r.json())
      .flatMap((perks: PerkResponse[]) => {
        return this.getProducts()
          .map((products: Products) => {
            perks.forEach((perk: PerkResponse) => {
              if (products[perk.product_id] != null) {
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
          });
      })
      .catch(() => Observable.of(response));
  }

  public getStatus(): Observable<ScheduledStatus> {
    return this.http.get(this.API_URL_PROTOOL + '/status')
      .map((r: Response) => r.json());
  }

  public deleteBillingInfo(billingInfoId: string): Observable<any> {
    return this.http.delete(this.API_URL + '/billing-info/' + billingInfoId)
      .map((r: Response) => r.json());
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
      wallacredits: []
    };
    return (product ? Observable.of(product) : this.getProducts())
      .map((products: Products) => {
        const valuesVar = groupBy(sortedPacks, (pack) => {
          return Object.keys(pack.benefits)[0];
        });
        const mins = mapValues(valuesVar, (packsArray) => {
          return min(packsArray.map((pack) => {
            return values(pack.benefits)[0];
          }));
        });
        sortedPacks.forEach((pack: PackResponse) => {
          const benefitsId: string = Object.keys(pack.benefits)[0];
          const name: string = PACKS_TYPES[products[benefitsId].name] ? PACKS_TYPES[products[benefitsId].name] : '';
          const baseQuantity = mins[benefitsId];
          const responsePrice: number = packsResponse[name][0] == null ? +pack.price : packsResponse[name][0].price;
          const basePrice: number = (pack.benefits[benefitsId] === baseQuantity ? +pack.price : responsePrice) / baseQuantity;
          const formattedPack: Pack = new Pack(
            pack.id,
            pack.benefits[benefitsId],
            +pack.price,
            pack.currency,
            name
          );
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
      });
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
      return Observable.of(this.products);
    }
    return this.http.get(this.API_URL + '/products')
      .map((r: Response) => r.json())
      .map((products: ProductResponse[]) => {
        this.products = keyBy(products, 'id');
        return this.products;
      });
  }
}

