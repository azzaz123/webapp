import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadConfirmationModalComponent } from './upload-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { ItemService } from '../../../../core/item/item.service';
import { PRODUCT_RESPONSE, ORDER_EVENT, PRODUCT_DURATION_ID, MOCK_ITEM } from '../../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs';
import { WindowRef } from '../../../../core/window/window.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

describe('UploadConfirmationModalComponent', () => {
  let component: UploadConfirmationModalComponent;
  let fixture: ComponentFixture<UploadConfirmationModalComponent>;
  let trackingService: TrackingService;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadConfirmationModalComponent, CustomCurrencyPipe],
      providers: [
        NgbActiveModal,
        WindowRef,
        DecimalPipe,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
            getUrgentProducts() {}
          }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return Observable.of({});
          }
        }
        }
      ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {
    it('should call and set credit info', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 200,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

      component.ngOnInit();

      expect(paymentService.getCreditInfo).toHaveBeenCalled();
      expect(component.creditInfo).toEqual(creditInfo);
    });
  });

  describe('urgentPrice', () => {
    it('should call urgentPrice', () => {
      spyOn(itemService, 'getUrgentProducts').and.returnValue(Observable.of(PRODUCT_RESPONSE));
      component.item = MOCK_ITEM;

      component.urgentPrice();

      expect(itemService.getUrgentProducts).toHaveBeenCalledWith(MOCK_ITEM.id);
      expect(component.productPrice).toEqual(+PRODUCT_RESPONSE.durations[0].market_code);
      expect(component.productId).toEqual(PRODUCT_RESPONSE.durations[0].id);
    });
  });

  describe('featureUrgentItem', () => {
    it('should close the modal with an order event', () => {
      spyOn(activeModal, 'close');
      spyOn(localStorage, 'setItem');
      component.item = MOCK_ITEM;
      component.productId = PRODUCT_DURATION_ID;
      component.productPrice = +PRODUCT_RESPONSE.durations[0].market_code;

      component.featureUrgentItem();

      expect(activeModal.close).toHaveBeenCalledWith(ORDER_EVENT);
      expect(localStorage.setItem).toHaveBeenCalledWith('transactionType', 'urgent');
    });
  });

  describe('trackUploaded', () => {
    it('should send the uploaded tracking', () => {
      spyOn(trackingService, 'track');
      component.item = MOCK_ITEM;

      component.trackUploaded();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.UPLOADFORM_SUCCESS, {categoryId: component.item.categoryId});
    });

    it('should send facebook AddToCart tracking', () => {
      spyOn(window, 'fbq');
      component.item = MOCK_ITEM;
      const event = {
        value: component.item.salePrice,
        currency: component.item.currencyCode,
        content_ids: component.item.id,
        content_type: component.item.categoryId,
      };

      component.trackUploaded();

      expect(window['fbq']).toHaveBeenCalledWith('track', 'AddToCart', event);
    });

    it('should send pinterest addtocart tracking', () => {
      spyOn(window, 'pintrk');
      component.item = MOCK_ITEM;
      const event = {
        value: component.item.salePrice,
        currency: component.item.currencyCode,
        line_items: [
          {
            product_category: component.item.categoryId,
            product_id: component.item.id,
          }
        ]
      };

      component.trackUploaded();

      expect(window['pintrk']).toHaveBeenCalledWith('track', 'addtocart', event);
    });
  });

});
