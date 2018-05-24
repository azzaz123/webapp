import { fakeAsync, TestBed } from '@angular/core/testing';

import { PurchaseService } from './purchase.service';
import { ItemService } from '../item/item.service';
import { getMockItem } from '../../../tests/item.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AUTORENEW_DATA, PURCHASES_RESPONSE, PURCHASING_ITEMS } from '../../../tests/payments.fixtures.spec';
import { Purchases, StatusResponse } from './purchase.interface';
import { HttpService } from '../http/http.service';

describe('PurchaseService', () => {

  let service: PurchaseService;
  let http: HttpService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        PurchaseService,
        {
          provide: ItemService, useValue: {
          getItemAndSetPurchaseInfo() {
          },
          resetAllPurchaseInfo() {
          }
        }
        }
      ]
    });
    service = TestBed.get(PurchaseService);
    http = TestBed.get(HttpService);
    itemService = TestBed.get(ItemService);
  });

  describe('query', () => {
    let response: Purchases;
    beforeEach(fakeAsync(() => {
      let res: ResponseOptions = new ResponseOptions({body: JSON.stringify([
        ...PURCHASES_RESPONSE,
        {
          'item_id': '30',
          'expiration_date': 1495870049678,
          'boost': false,
          'highlight': true,
          'autorenew': false
        }
      ])});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      spyOn(itemService, 'resetAllPurchaseInfo');
      spyOn(itemService, 'getItemAndSetPurchaseInfo').and.returnValues(
        getMockItem('1', 1),
        getMockItem('2', 2),
        getMockItem('3', 3),
        undefined);
      service.query().subscribe((r: Purchases) => {
        response = r;
      });
    }));
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/protool/purchases');
    });
    it('should return perks', () => {
      expect(response.nationalBumpItems.length).toEqual(2);
      expect(response.nationalBumpItems[0].item_id).toEqual('1');
      expect(response.nationalBumpItems[1].item_id).toEqual('3');
      expect(response.bumpItems.length).toEqual(1);
      expect(response.bumpItems[0].item_id).toEqual('2');
    });
    it('should call resetAllPurchaseInfo', () => {
      expect(itemService.resetAllPurchaseInfo).toHaveBeenCalled();
    });
  });

  describe('updateAutorenew', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.callThrough();

      service.updateAutorenew(AUTORENEW_DATA).subscribe();

      expect(http.put).toHaveBeenCalledWith('api/v3/protool/autorenew/update', AUTORENEW_DATA);
    });
  });

  describe('executeAutorenew', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();

      service.executeAutorenew().subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/protool/autorenew/execute');
    });
  });

  describe('purchaseItems', () => {
    it('should call endpoint and return response', () => {
      let response: string[];
      const RESPONSE: string[] = ['1', '2'];
      let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));

      service.purchaseItems(PURCHASING_ITEMS).subscribe((data: string[]) => {
        response = data;
      });

      expect(http.post).toHaveBeenCalledWith('api/v3/protool/purchaseItems', PURCHASING_ITEMS);
      expect(response).toEqual(RESPONSE);
    });
  });

  describe('getStatus', () => {
    it('should call endpoint and return response', () => {
      let response: StatusResponse;
      const RESPONSE: StatusResponse = {
        autorenew_alert: 20,
        active: true
      };
      let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getStatus().subscribe((data: StatusResponse) => {
        response = data;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/protool/status');
      expect(response).toEqual(RESPONSE);
    });
  });
});
