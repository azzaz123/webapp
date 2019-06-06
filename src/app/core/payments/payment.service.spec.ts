import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { PaymentService } from './payment.service';
import { Observable } from 'rxjs';
import {
  BillingInfoResponse, CreditInfo, FinancialCard, Packs, Perks, Products,
  SabadellInfoResponse
} from './payment.interface';
import {
  BILLING_INFO_RESPONSE,
  BUMPS_PRODUCT_RESPONSE,
  createPacksFixture, createWallacoinsPacksFixture, createWallacreditsPacksFixture,
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
import { COINS_FACTOR, COINS_PACK_ID, CREDITS_FACTOR, CREDITS_PACK_ID, Pack } from './pack';
import { UserService } from '../user/user.service';
import { PERMISSIONS } from '../user/user';


describe('PaymentService', () => {

  let service: PaymentService;
  let http: HttpService;
  let userService: UserService;

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
    userService = TestBed.get(UserService);
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

  describe('paymentIntents', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();
      const paymentIntent = 'a1-b2-c3-d4';

      service.paymentIntents('1', paymentIntent).subscribe();

      expect(http.post).toHaveBeenCalledWith(`api/v3/payments/c2b/stripe/payment_intents/${paymentIntent}`, {
        order_id: '1'
      });
    });
  });

  describe('paymentIntentsConfirm', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();
      const paymentIntent = 'a1-b2-c3-d4';
      const orderId = '1';
      const paymentMethodId = 'pm_a1b2c3d4';

      service.paymentIntentsConfirm(orderId, paymentIntent, paymentMethodId).subscribe();

      expect(http.post).toHaveBeenCalledWith(`api/v3/payments/c2b/stripe/payment_intents/${paymentIntent}/confirm`, {
        order_id: orderId,
        payment_method_id: paymentMethodId
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

  describe('getCreditInfo', () => {

    const PERKS_MODEL = new PerksModel();

    it('should call getPerks, hasPerm and return credit and wallacoins if perm is true', () => {
      let resp: CreditInfo;
      spyOn(userService, 'hasPerm').and.returnValue(Observable.of(true));
      spyOn(service, 'getPerks').and.returnValue(Observable.of(PERKS_MODEL));
      const CREDIT = 100;
      PERKS_MODEL.wallacoins.quantity = CREDIT;

      service.getCreditInfo().subscribe((r: CreditInfo) => {
        resp = r;
      });

      expect(service.getPerks).toHaveBeenCalledWith(true);
      expect(userService.hasPerm).toHaveBeenCalledWith(PERMISSIONS.coins);
      expect(resp).toEqual({
        currencyName: 'wallacoins',
        credit: CREDIT,
        factor: COINS_FACTOR
      });
    });

    it('should call getPerks, hasPerm and return credit and wallacredits if perm is false', () => {
      let resp: CreditInfo;
      spyOn(userService, 'hasPerm').and.returnValue(Observable.of(false));
      spyOn(service, 'getPerks').and.returnValue(Observable.of(PERKS_MODEL));
      const CREDIT = 100;
      PERKS_MODEL.wallacredits.quantity = CREDIT;

      service.getCreditInfo().subscribe((r: CreditInfo) => {
        resp = r;
      });

      expect(service.getPerks).toHaveBeenCalledWith(true);
      expect(userService.hasPerm).toHaveBeenCalledWith(PERMISSIONS.coins);
      expect(resp).toEqual({
        currencyName: 'wallacredits',
        credit: CREDIT,
        factor: CREDITS_FACTOR
      });
    });
  });

  describe('getCoinsCreditsPacks', () => {

    it('should call hasPerm', () => {
      spyOn(userService, 'hasPerm').and.callThrough();

      service.getCoinsCreditsPacks().subscribe();

      expect(userService.hasPerm).toHaveBeenCalledWith('coins');
    });

    it('should call getCoinsPacks if user has perm', () => {
      spyOn(service, 'getCoinsPacks').and.callThrough();

      service.getCoinsCreditsPacks().subscribe();

      expect(service.getCoinsPacks).toHaveBeenCalled();
    });

    it('should call getCreditsPacks if user has no perm', () => {
      spyOn(userService, 'hasPerm').and.returnValue(Observable.of(false));
      spyOn(service, 'getCreditsPacks').and.callThrough();

      service.getCoinsCreditsPacks().subscribe();

      expect(service.getCreditsPacks).toHaveBeenCalled();
    });
  });

  describe('getCoinsPacks', () => {

    let resp: Pack[];

    beforeEach(() => {
      spyOn(service, 'getPacks').and.returnValue(Observable.of(createWallacoinsPacksFixture()));

      service.getCoinsPacks().subscribe((r: Pack[]) => {
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

    it('should return an array of wallacoins packs', () => {
      expect(resp.length).toBe(6);
      expect(resp[0] instanceof Pack).toBe(true);
      expect(resp[0].name).toBe('wallacoins');
    });
  });

  describe('getCreditsPacks', () => {

    let resp: Pack[];

    beforeEach(() => {
      spyOn(service, 'getPacks').and.returnValue(Observable.of(createWallacreditsPacksFixture()));

      service.getCreditsPacks().subscribe((r: Pack[]) => {
        resp = r;
      });
    });

    it('should call getPacks', () => {
      expect(service.getPacks).toHaveBeenCalledWith({
        [CREDITS_PACK_ID]: {
          id: CREDITS_PACK_ID,
          name: 'WALLACREDITS'
        }
      });
    });

    it('should return an array of wallacredits packs', () => {
      expect(resp.length).toBe(6);
      expect(resp[0] instanceof Pack).toBe(true);
      expect(resp[0].name).toBe('wallacredits');
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

  describe('deleteCache', () => {
    it('should delete cache', () => {
      service['perksModel'] = new PerksModel();

      service.deleteCache();

      expect(service['perksModel']).toBeNull();
    });
  });
});
