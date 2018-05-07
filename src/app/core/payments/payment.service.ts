import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FinancialCard, SabadellInfoResponse, PerkResponse, Products, ProductResponse } from './payment.interface';
import { HttpService } from '../http/http.service';
import { PerksModel } from './payment.model';
import * as _ from 'lodash';

@Injectable()
export class PaymentService {

  private API_URL = 'api/v3/payments';
  private perksModel: PerksModel;
  private products: Products;

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

  public pay(orderId: string): Observable<any> {
    return this.http.post(this.API_URL + '/c2b/sabadell/tpv/pay', {
      order_id: orderId
    });
  }

  public getPerks(cache: boolean = true): Observable<PerksModel> {
    if (cache && this.perksModel) {
      return Observable.of(this.perksModel);
    }
    let response = new PerksModel();

    return this.http.get(this.API_URL + '/perks/me')
      .map((r: Response) => r.json())
      .flatMap((perks: PerkResponse[]) => {
        return this.getProducts()
          .map((products: Products) => {
            perks.forEach((perk: PerkResponse) => {
              if (products[perk.product_id] != null) {
                let name: string = products[perk.product_id].name;
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
