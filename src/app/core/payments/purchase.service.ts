import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AutorenewItem, Purchase, PurchasingItem, StatusResponse } from './purchase.interface';
import { ItemService } from '../item/item.service';
import * as _ from 'lodash';
import { PurchasesModel } from './purchase.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HttpService } from '../http/http.service';

@Injectable()
export class PurchaseService {

  private API_URL: string = 'api/v3/protool';
  private observableResults$: ReplaySubject<PurchasesModel> = new ReplaySubject(1);

  constructor(private http: HttpService,
              private itemService: ItemService) {
  }

  public query(): Observable<PurchasesModel> {
    return this.http.get(this.API_URL + '/purchases')
      .map((r: Response) => r.json())
      .map((purchases: any[]) => {
        this.itemService.resetAllPurchaseInfo();
        purchases = _.filter(purchases.map((purchase: Purchase) => {
          purchase.item = this.itemService.getItemAndSetPurchaseInfo(purchase.item_id, purchase);
          return purchase;
        }), (purchase: Purchase) => purchase.item);

        let model = new PurchasesModel();
        model.bumpItems = _.filter(purchases, {bump: true});
        model.nationalBumpItems = _.filter(purchases, {national: true});

        this.observableResults$.next(model);
        return model;
      });
  }

  public subscriberForPurchases(): ReplaySubject<PurchasesModel> {
    return this.observableResults$;
  }

  public updateAutorenew(data: AutorenewItem[]) {
    return this.http.put(this.API_URL + '/autorenew/update', data);
  }

  public executeAutorenew(): Observable<any> {
    return this.http.post(this.API_URL + '/autorenew/execute');
  }

  public purchaseItems(data: PurchasingItem[]): Observable<string[]> {
    return this.http.post(this.API_URL + '/purchaseItems', data)
      .map((r: Response) => r.json());
  }

  public getStatus(): Observable<StatusResponse> {
    return this.http.get(this.API_URL + '/status')
      .map((r: Response) => r.json());
  }

}
