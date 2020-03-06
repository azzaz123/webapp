import { TestBed } from '@angular/core/testing';
import { PaymentService, PAYMENTS_API_URL, PROTOOL_API_URL } from './payment.service';
import { Observable } from 'rxjs';
import {
  BillingInfoResponse, CreditInfo, Packs, Products
} from './payment.interface';
import {
  BILLING_INFO_RESPONSE,
  BUMPS_PRODUCT_RESPONSE,
  createPacksFixture, createWallacreditsPacksFixture,
  PACK_RESPONSE,
  PERK_RESPONSE,
  PRODUCTS_RESPONSE_PACKS,
  ORDER_CART_EXTRAS_PRO,
  WALLACREDITS_PACKS_RESPONSE
} from '../../../tests/payments.fixtures.spec';
import { PerksModel } from './payment.model';
import { PRODUCT_RESPONSE } from '../../../tests/item.fixtures.spec';
import { CREDITS_FACTOR, CREDITS_PACK_ID, Pack } from './pack';
import { environment } from '../../../environments/environment';
import { TestRequest, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';


describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(PaymentService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getBillingInfo', () => {
    it('should get user billing info', () => {
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

  describe('getPacks', () => {
    describe('when no products are selected', () => {
      it('should return all packs', () => {
        const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/packs`;
        const expectedProductsUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/products`;
        let response: Packs;

        service.getPacks().subscribe((r: Packs) => {
          response = r;
        });
        const reqPacks: TestRequest = httpMock.expectOne(expectedUrl);
        reqPacks.flush(PACK_RESPONSE);
        const reqProducts: TestRequest = httpMock.expectOne(expectedProductsUrl);
        reqProducts.flush(PRODUCTS_RESPONSE_PACKS);

        expect(reqPacks.request.url).toEqual(expectedUrl);
        expect(response).toEqual(createPacksFixture());
        expect(reqPacks.request.method).toBe('GET');
      });
    });

    describe('when products are selected', () => {
      it('should return packs related with the selected products', () => {
        const product: Products = {
          [CREDITS_PACK_ID]: {
            id: CREDITS_PACK_ID,
            name: 'WALLACREDITS'
          }
        };
        const expectedUrlParams = `products=${Object.keys(product)[0]}`;
        const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/packs?${expectedUrlParams}`;
        let response: Packs;

        service.getPacks(product).subscribe((r: Packs) => {
          response = r;
        });
        const reqPacks: TestRequest = httpMock.expectOne(expectedUrl);
        reqPacks.flush(WALLACREDITS_PACKS_RESPONSE);

        expect(reqPacks.request.urlWithParams).toEqual(expectedUrl);
        expect(response).toEqual(createWallacreditsPacksFixture());
        expect(reqPacks.request.method).toBe('GET');
      });
    });
  });

  describe('getCreditInfo', () => {
    const PERKS_MODEL = new PerksModel();

    it('should get user credit', () => {
      let resp: CreditInfo;
      spyOn(service, 'getPerks').and.returnValue(Observable.of(PERKS_MODEL));
      const CREDIT = 100;
      PERKS_MODEL.wallacredits.quantity = CREDIT;

      service.getCreditInfo().subscribe((r: CreditInfo) => {
        resp = r;
      });

      expect(service.getPerks).toHaveBeenCalledWith(true);
      expect(resp).toEqual({
        currencyName: 'wallacredits',
        credit: CREDIT,
        factor: CREDITS_FACTOR
      });
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

  describe('getSubscriptionPacks', () => {
    it('should return user subscription packs', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/subscription/packs`;
      const expectedProductsUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/products`;
      let response: Packs;

      service.getSubscriptionPacks().subscribe(r => response = r);
      const reqPacks: TestRequest = httpMock.expectOne(expectedUrl);
      reqPacks.flush(PACK_RESPONSE);
      const reqProducts: TestRequest = httpMock.expectOne(expectedProductsUrl);
      reqProducts.flush(BUMPS_PRODUCT_RESPONSE);

      expect(reqPacks.request.url).toEqual(expectedUrl);
      expect(response).toEqual(createPacksFixture());
      expect(reqPacks.request.method).toBe('GET');
    });
  });

  describe('orderExtrasProPack', () => {
    it('should create a pack order', () => {
      const expectedUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/c2b/pack-order/create`;

      service.orderExtrasProPack(ORDER_CART_EXTRAS_PRO).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(ORDER_CART_EXTRAS_PRO);
    });
  });

  describe('getPerks', () => {
    it('should get user perks', () => {
      const returnPerksModel = new PerksModel();
      const expectedPerksUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/perks/me`;
      const expectedProductsUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/products`;
      let response: PerksModel;

      service.getPerks(false).subscribe(r => response = r);
      const reqPerks: TestRequest = httpMock.expectOne(expectedPerksUrl);
      reqPerks.flush(PERK_RESPONSE);
      const reqProducts: TestRequest = httpMock.expectOne(expectedProductsUrl);
      reqProducts.flush(PRODUCT_RESPONSE);

      expect(reqPerks.request.url).toEqual(expectedPerksUrl);
      expect(response).toEqual(returnPerksModel);
      expect(reqPerks.request.method).toBe('GET');
    });

    it('should return cached perks after the first call', () => {
      const expectedPerksUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/perks/me`;
      const expectedProductsUrl = `${environment.baseUrl}${PAYMENTS_API_URL}/products`;

      service.getPerks(false).subscribe();
      const reqPerks: TestRequest = httpMock.expectOne(expectedPerksUrl);
      reqPerks.flush(PERK_RESPONSE);
      const reqProducts: TestRequest = httpMock.expectOne(expectedProductsUrl);
      reqProducts.flush(PRODUCT_RESPONSE);

      service.getPerks(true).subscribe();
      httpMock.expectNone(expectedPerksUrl);
    });
  });

  describe('getStatus', () => {
    it('should get scheduled bumps status', () => {
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
