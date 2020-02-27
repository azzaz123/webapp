import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { PaymentService, PAYMENTS_API_URL, PROTOOL_API_URL } from './payment.service';
import { Observable } from 'rxjs';
import {
  BillingInfoResponse, CreditInfo, FinancialCard, Packs, Perks, Products
} from './payment.interface';
import {
  BILLING_INFO_RESPONSE,
  BUMPS_PRODUCT_RESPONSE,
  createPacksFixture, createWallacoinsPacksFixture, createWallacreditsPacksFixture,
  FINANCIAL_CARD,
  PACK_RESPONSE,
  PERK_RESPONSE,
  PRODUCTS_RESPONSE_PACKS,
  WALLACOINS_PACKS_RESPONSE,
  ORDER_CART_EXTRAS_PRO
} from '../../../tests/payments.fixtures.spec';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { PerksModel } from './payment.model';
import { PRODUCT_RESPONSE } from '../../../tests/item.fixtures.spec';
import { COINS_FACTOR, COINS_PACK_ID, CREDITS_FACTOR, CREDITS_PACK_ID, Pack } from './pack';
import { UserService } from '../user/user.service';
import { PERMISSIONS } from '../user/user';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';


describe('PaymentService', () => {

  let service: PaymentService;
  let http: HttpService;
  let userService: UserService;
  let httpMock: HttpTestingController;

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
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(PaymentService);
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

  xdescribe('getCoinsCreditsPacks', () => {
    const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/packs`;

    it('should call getCoinsPacks if user has perm', () => {
      spyOn(service, 'getCoinsPacks').and.callThrough();

      service.getCoinsCreditsPacks().subscribe();
      httpMock.expectOne(expectedUrl);

      expect(service.getCoinsPacks).toHaveBeenCalled();
    });

    it('should call getCreditsPacks if user has no perm', () => {
      spyOn(userService, 'hasPerm').and.returnValue(Observable.of(false));
      spyOn(service, 'getCreditsPacks').and.callThrough();

      service.getCoinsCreditsPacks().subscribe();
      httpMock.expectOne(expectedUrl);

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
    it('should get the user billing info', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/billing-info/me`;
      let response: BillingInfoResponse;

      service.getBillingInfo().subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(BILLING_INFO_RESPONSE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(BILLING_INFO_RESPONSE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('updateBillingInfo', () => {
    it('should update user billing info', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/billing-info`;
      const requestBody = { data: 'test' };

      service.updateBillingInfo(requestBody).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(requestBody);
    });
  });

  describe('paymentIntents', () => {
    it('should call endpoint', () => {
      const paymentId = 'a1-b2-c3-d4';
      const orderId = '1';
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_intents/${paymentId}`;

      service.paymentIntents(orderId, paymentId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ order_id: orderId });
    });
  });

  describe('paymentIntentsConfirm', () => {
    it('should call endpoint', () => {
      const paymentId = 'a1-b2-c3-d4';
      const orderId = '1';
      const paymentMethodId = 'pm_a1b2c3d4';
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_intents/${paymentId}/confirm`;

      service.paymentIntentsConfirm(orderId, paymentId, paymentMethodId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        order_id: orderId,
        payment_method_id: paymentMethodId
      });
    });
  });

  xdescribe('getPacks', () => {
    let response: Packs;

    describe('with no param', () => {
      beforeEach(fakeAsync(() => {
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(PACK_RESPONSE) });
        const res2: ResponseOptions = new ResponseOptions({ body: JSON.stringify(PRODUCTS_RESPONSE_PACKS) });
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
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(WALLACOINS_PACKS_RESPONSE) });
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

  xdescribe('getSubscriptionPacks', () => {
    let response: Packs;

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(PACK_RESPONSE) });
      const res2: ResponseOptions = new ResponseOptions({ body: JSON.stringify(BUMPS_PRODUCT_RESPONSE) });
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

  describe('orderExtrasProPack', () => {
    it('', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/pack-order/create`;

      service.orderExtrasProPack(ORDER_CART_EXTRAS_PRO).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(ORDER_CART_EXTRAS_PRO);
    });
  });

  xdescribe('getPerks', () => {
    let response: Perks;
    const returnPerksModel = new PerksModel();

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(PERK_RESPONSE) });
      const res2: ResponseOptions = new ResponseOptions({ body: JSON.stringify(PRODUCT_RESPONSE) });
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

  describe('getStatus', () => {
    it('', () => {
      const expectedUrl = `${environment.baseUrl}${PROTOOL_API_URL}/status`;

      service.getStatus().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('deleteBillingInfo', () => {
    it('should call http delete method with deleteBillingInfo endpoint and billingInfoId', () => {
      const billingInfoId = '11413';
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/billing-info/${billingInfoId}`;

      service.deleteBillingInfo(billingInfoId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('DELETE');
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
