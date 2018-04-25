import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import {
  BillingInfoResponse,
  FinancialCard,
  Pack,
  PackResponse, ProductResponse,
  Products,
  SabadellInfoResponse
} from './payment.interface';
import { HttpService } from '../http/http.service';
import { PacksModel } from './payment.model';
import * as _ from 'lodash';


@Injectable()
export class PaymentService {

  private API_URL = 'api/v3/payments';
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

  public getBillingInfo(): Observable<BillingInfoResponse> {
    return this.http.get(this.API_URL + '/billing-info/me')
      .map((r: Response) => r.json());
  }

  public updateBillingInfo(data: any): Observable<any> {
    return this.http.put(this.API_URL + '/billing-info', data);
  }

  public getPacks(): Observable<PacksModel> {
    let response = new PacksModel();

    return this.http.get(this.API_URL + '/packs')
      .map((r: Response) => r.json())
      .flatMap((packs: PackResponse[]) => {
        let sortedPacks = this.sortPacksByQuantity(packs);
        return this.getProducts()
          .map((products: Products) => {
            let values = _.groupBy(sortedPacks, (pack) => {
              return Object.keys(pack.benefits)[0];
            });
            let mins = _.mapValues(values, (packsArray) => {
              return _.min(packsArray.map((pack) => {
                return _.values(pack.benefits)[0];
              }));
            });
            sortedPacks.forEach((pack: PackResponse) => {
              let benefitsId: string = Object.keys(pack.benefits)[0];
              let name: string = products[benefitsId].name === 'BUMP' ? 'bumps' : (products[benefitsId].name === 'NATIONAL_BUMP') ?
                'nationals' : '';
              let baseQuantity = mins[benefitsId];
              let responsePrice: number =  response[name][0] == null ? +pack.price : response[name][0].price;
              let basePrice: number = (pack.benefits[benefitsId] === baseQuantity ? +pack.price : responsePrice) / baseQuantity;
              let formattedPack: Pack = {
                id: pack.id,
                quantity: pack.benefits[benefitsId],
                price: +pack.price,
                currency: pack.currency,
                discount: this.calculateDiscount(pack.price, pack.benefits[benefitsId], basePrice)
              } as Pack;

              if (products[benefitsId].name === 'NATIONAL_BUMP') {
                response.addNationalPack(formattedPack);
              } else if (products[benefitsId].name === 'BUMP') {
                response.addBump(formattedPack);
              }
            });
            return response;
          });
      });
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

  private calculateDiscount(packPrice: string, quantity: number, basePrice: number): number {
    const price: number = basePrice * quantity;
    const save: number = price - +packPrice;
    return Math.floor(save * 100 / price);
  }

  private sortPacksByQuantity(packs: PackResponse[]): PackResponse[] {
    let sortedPacks = packs.sort(function(a, b) {
      let quantityA: any = _.values(a.benefits)[0];
      let quantityB: any = _.values(b.benefits)[0];
      return quantityA - quantityB;
    });
    return sortedPacks;
  }

}
