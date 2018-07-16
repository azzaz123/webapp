import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { PaymentService } from './payment.service';
import { Observable } from 'rxjs/Observable';
import { BillingInfoResponse, FinancialCard, Packs, Perks, Products, SabadellInfoResponse } from './payment.interface';
import {
  BILLING_INFO_RESPONSE,
  BUMPS_PRODUCT_RESPONSE,
  createPacksFixture, createWallacoinsPacksFixture,
  FINANCIAL_CARD,
  PACK_RESPONSE,
  PERK_RESPONSE,
  PRODUCTS_RESPONSE_PACKS,
  SABADELL_RESPONSE,
  WALLACOINS_PACKS_RESPONSE
} from '../../../tests/payments.fixtures.spec';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { PerksModel } from './payment.model';
import { PRODUCT_RESPONSE } from '../../../tests/item.fixtures.spec';
import { COINS_PACK_ID, Pack } from './pack';
import { UserService } from '../user/user.service';


describe('PaymentService', () => {

  let service: PaymentService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        PaymentService,
        {
          provide: UserService, useValue: {
          hasPerm() {
            return Observable.of(true);
          }
        }
        }
      ]
    });
    service = TestBed.get(PaymentService);
    http = TestBed.get(HttpService);
  });

  describe('pay', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();
      service.pay('1').subscribe();
      expect(http.post).toHaveBeenCalledWith('api/v3/payments/c2b/sabadell/tpv/pay', {
        order_id: '1'
      });
    });
  });

  describe('getFinancialCard', () => {
    let response: FinancialCard;
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(FINANCIAL_CARD)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getFinancialCard().subscribe((r: FinancialCard) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/c2b/financial-card');
      expect(response).toEqual(FINANCIAL_CARD);
    });
  });

  describe('deleteFinancialCard', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify({})});
      spyOn(http, 'delete').and.returnValue(Observable.of(new Response(res)));
      service.deleteFinancialCard().subscribe();
      expect(http.delete).toHaveBeenCalledWith('api/v3/payments/c2b/financial-card');
    });
  });

  describe('getSabadellInfo', () => {
    let response: SabadellInfoResponse;
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(SABADELL_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getSabadellInfo('1').subscribe((r: SabadellInfoResponse) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/c2b/sabadell/tpv/params', {orderId: '1'});
      expect(response).toEqual(SABADELL_RESPONSE);
    });
  });

  describe('getPacks', () => {
    let response: Packs;

    describe('with no param', () => {
      beforeEach(fakeAsync(() => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PACK_RESPONSE)});
        const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE_PACKS)});
        spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));

        service.getPacks().subscribe((r: Packs) => {
          response = r;
        });
      }));
      it('should call endpoint', () => {
        expect(http.get).toHaveBeenCalledWith('api/v3/payments/packs', undefined);
        expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
      });

      it('should return packs', () => {
        expect(response).toEqual(createPacksFixture());
      });
    });

    describe('with param', () => {
      const product: Products = {
        [COINS_PACK_ID]: {
          id: COINS_PACK_ID,
          name: 'WALLACOINS'
        }
      };

      beforeEach(fakeAsync(() => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(WALLACOINS_PACKS_RESPONSE)});
        spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)));

        service.getPacks(product).subscribe((r: Packs) => {
          response = r;
        });
      }));

      it('should call endpoint', () => {
        expect(http.get).toHaveBeenCalledWith('api/v3/payments/packs', {
          products: COINS_PACK_ID
        });
        expect(http.get).not.toHaveBeenCalledWith('api/v3/payments/products');
      });

      it('should return packs', () => {
        expect(response).toEqual(createWallacoinsPacksFixture());
      });
    });

  });

  describe('getCoinsPacks', () => {

    let resp: Pack[][];

    beforeEach(() => {
      spyOn(service, 'getPacks').and.returnValue(Observable.of(createWallacoinsPacksFixture()));

      service.getCoinsPacks().subscribe((r: Pack[][]) => {
        resp = r;
      });
    });

    it('should call getPacks', () => {
      expect(service.getPacks).toHaveBeenCalledWith({
        [COINS_PACK_ID]: {
          id: COINS_PACK_ID,
          name: 'WALLACOINS'
        }
      });
    });

    it('should return an array of wallacoins packs array', () => {
      expect(resp.length).toBe(2);
      expect(resp[0].length).toBe(3);
      expect(resp[1].length).toBe(3);
      expect(resp[0][0] instanceof Pack).toBe(true);
      expect(resp[0][0].name).toBe('wallacoins');
    });
  });

  describe('getBillingInfo', () => {
    let response: BillingInfoResponse;

    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(BILLING_INFO_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getBillingInfo().subscribe((r: BillingInfoResponse) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/payments/billing-info/me');
      expect(response).toEqual(BILLING_INFO_RESPONSE);
    });
  });

  describe('updateBillingInfo', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put');

      service.updateBillingInfo({
        data: 'test'
      });

      expect(http.put).toHaveBeenCalledWith('api/v3/payments/billing-info', {
        data: 'test'
      });
    });
  });

  describe('getSubscriptionPacks', () => {
    let response: Packs;

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PACK_RESPONSE)});
      const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(BUMPS_PRODUCT_RESPONSE)});
      spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));

      service.getSubscriptionPacks().subscribe((r: Packs) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/subscription/packs');
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
    });

    it('should return packs', () => {
      expect(response).toEqual(createPacksFixture());
    });
  });

  describe('getPerks', () => {
    let response: Perks;
    const returnPerksModel = new PerksModel();

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PERK_RESPONSE)});
      const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCT_RESPONSE)});
      spyOn(http, 'get').and.returnValues(
        Observable.of(new Response(res)),
        Observable.of(new Response(res2)),
        Observable.of(new Response(res)),
        Observable.of(new Response(res2))
      );

      service.getPerks().subscribe((r: Perks) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/perks/me');
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
    });

    it('should return perks', () => {
      expect(response).toEqual(returnPerksModel);
    });

    it('should not call endpoint the second time', () => {
      http.get['calls'].reset();

      service.getPerks().subscribe((r: Perks) => {
        response = r;
      });

      expect(response).toEqual(returnPerksModel);
      expect(http.get).not.toHaveBeenCalled();
    });

    it('should call endpoint the second time if cache false', () => {
      http.get['calls'].reset();

      service.getPerks(false).subscribe((r: Perks) => {
        response = r;
      });

      expect(response).toEqual(returnPerksModel);
      expect(http.get).toHaveBeenCalled();
    });
  });

  describe('deleteBillingInfo', () => {
    it('should call http delete method with deleteBillingInfo endpoint and billingInfoId', () => {
      spyOn(http, 'delete').and.callThrough();

      service.deleteBillingInfo('123');

      expect(http.delete).toHaveBeenCalledWith('api/v3/payments/billing-info/123');
    });
  });
});
