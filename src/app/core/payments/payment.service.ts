import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FinancialCard, SabadellInfoResponse, Packs, ProductResponse, Products, PackResponse } from './payment.interface';
import { HttpService } from '../http/http.service';
import * as _ from 'lodash';
import { Pack } from './pack';

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

  public getPacks(): Observable<Packs> {
    const packsResponse: Packs = {
      cityBumps: [],
      nationalBumps: []
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
          const name: string = products[benefitsId].name === 'BUMP' ? 'cityBumps' : (products[benefitsId].name === 'NATIONAL_BUMP') ?
            'nationalBumps' : '';
          const baseQuantity = mins[benefitsId];
          const responsePrice: number =  packsResponse[name][0] == null ? +pack.price : packsResponse[name][0].price;
          const basePrice: number = (pack.benefits[benefitsId] === baseQuantity ? +pack.price : responsePrice) / baseQuantity;
          const formattedPack: Pack = new Pack(
            pack.id,
            pack.benefits[benefitsId],
            +pack.price,
            pack.currency
          );
          formattedPack.calculateDiscount(pack.price, pack.benefits[benefitsId], basePrice);

          if (products[benefitsId].name === 'NATIONAL_BUMP') {
            packsResponse.nationalBumps.push(formattedPack);
          } else if (products[benefitsId].name === 'BUMP') {
            packsResponse.cityBumps.push(formattedPack);
          }
        });
        return packsResponse;
      });
    });
  }

  private sortPacksByQuantity(packs: PackResponse[]): PackResponse[] {
    const sortedPacks = packs.sort(function(a, b) {
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
