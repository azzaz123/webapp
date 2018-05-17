import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FinancialCard, SabadellInfoResponse, Packs,
  ProductResponse, Products, PackResponse, BillingInfoResponse, OrderProExtras, PerkResponse } from './payment.interface';
import { HttpService } from '../http/http.service';
import * as _ from 'lodash';
import { Pack, PACKS_TYPES } from './pack';
import { PerksModel } from './payment.model';

@Injectable()
export class PaymentService {

  private API_URL = 'api/v3/payments';
  private products: Products;
  private perksModel: PerksModel;
  constructor(private http: HttpService) {
  }

  public getFinancialCard(): Observable<FinancialCard> {
    return this.http.get(this.API_URL + '/c2b/financial-card')
      .map((r: Response) => r.json());
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

  public getPacks(): Observable<Packs> {
    const packsResponse: Packs = {
      cityBump: [],
      countryBump: [],
      listings: []
    };

    return this.http.get(this.API_URL + '/packs')
    .map((r: Response) => r.json())
    .flatMap((packs: PackResponse[]) => {
      const sortedPacks = this.sortPacksByQuantity(packs);
      return this.getProducts()
      .map((products: Products) => {
        const values = _.groupBy(sortedPacks, (pack) => {
          return Object.keys(pack.benefits)[0];
        });
        const mins = _.mapValues(values, (packsArray) => {
          return _.min(packsArray.map((pack) => {
            return _.values(pack.benefits)[0];
          }));
        });
        sortedPacks.forEach((pack: PackResponse) => {
          const benefitsId: string = Object.keys(pack.benefits)[0];
          const name: string = PACKS_TYPES[products[benefitsId].name] ? PACKS_TYPES[products[benefitsId].name] : '';
          const baseQuantity = mins[benefitsId];
          const responsePrice: number =  packsResponse[name][0] == null ? +pack.price : packsResponse[name][0].price;
          const basePrice: number = (pack.benefits[benefitsId] === baseQuantity ? +pack.price : responsePrice) / baseQuantity;
          const formattedPack: Pack = new Pack(
            pack.id,
            pack.benefits[benefitsId],
            +pack.price,
            pack.currency,
            name
          );
          formattedPack.calculateDiscount(pack.price, pack.benefits[benefitsId], basePrice);

          if (products[benefitsId].name === 'NATIONAL_BUMP') {
            packsResponse.countryBump.push(formattedPack);
          } else if (products[benefitsId].name === 'BUMP') {
            packsResponse.cityBump.push(formattedPack);
          }
        });
        return packsResponse;
      });
    });
  }

  public getSubscriptionPacks(): Observable<Packs> {
    const packsResponse: Packs = {
      cityBump: [],
      countryBump: [],
      listings: []
    };

    return this.http.get(this.API_URL + '/subscription/packs')
    .map((r: Response) => r.json())
    .flatMap((packs: PackResponse[]) => {
      const sortedPacks = this.sortPacksByQuantity(packs);
      return this.getProducts()
        .map((products: Products) => {
          const values = _.groupBy(sortedPacks, (pack) => {
            return Object.keys(pack.benefits)[0];
          });
          const mins = _.mapValues(values, (packsArray) => {
            return _.min(packsArray.map((pack) => {
              return _.values(pack.benefits)[0];
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
            formattedPack.calculateDiscount(pack.price, pack.benefits[benefitsId], basePrice);

            if (products[benefitsId].name === 'NATIONAL_BUMP') {
              packsResponse.countryBump.push(formattedPack);
            } else if (products[benefitsId].name === 'BUMP') {
              packsResponse.cityBump.push(formattedPack);
            } else if (products[benefitsId].name === 'LISTINGS') {
              packsResponse.listings.push(formattedPack);
            }
          });
          return packsResponse;
        });
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
                }
              }
            });
            this.perksModel = response;
            return response;
          });
      })
      .catch(() => Observable.of(response));
  }

  private sortPacksByQuantity(packs: PackResponse[]): PackResponse[] {
    const sortedPacks = packs.sort(function (a, b) {
      const quantityA: any = _.values(a.benefits)[0];
      const quantityB: any = _.values(b.benefits)[0];
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
      this.products = _.keyBy(products, 'id');
      return this.products;
    });
  }
}

