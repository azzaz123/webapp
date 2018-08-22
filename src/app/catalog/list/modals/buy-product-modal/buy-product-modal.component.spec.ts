import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProductModalComponent } from './buy-product-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { Observable } from 'rxjs/Observable';
import { MOCK_ITEM_V3, ORDER_EVENT } from '../../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../../core/item/item.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { UUID } from 'angular2-uuid';
import { OrderEvent } from '../../selected-items/selected-product.interface';

describe('BuyProductModalComponent', () => {
  let component: BuyProductModalComponent;
  let fixture: ComponentFixture<BuyProductModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let paymentService: PaymentService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyProductModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: ItemService, useValue: {
          get() {
            return Observable.of(MOCK_ITEM_V3);
          },
          purchaseProductsWithCredits() {
            return Observable.of({
              payment_needed: true
            });
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
          close() {
          },
          dismiss() {
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return Observable.of({});
          },
          pay() {
            return Observable.of('');
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyProductModalComponent);
    component = fixture.componentInstance;
    component.orderEvent = {...ORDER_EVENT} as OrderEvent;
    fixture.detectChanges();
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
    paymentService = TestBed.get(PaymentService);
    eventService = TestBed.get(EventService);
  });

  describe('ngOnInit', () => {
    it('should get and set item', () => {
      spyOn(itemService, 'get').and.callThrough();

      component.ngOnInit();

      expect(component.item).toEqual(MOCK_ITEM_V3);
      expect(component.item.urgent).toBe(true);
    });

    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });

    it('should call getCreditInfo and set it with wallacredits if credit is 0', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1
      });
    });
  });

  describe('withCredits', () => {
    it('should return true if has wallacredits', () => {
      component.creditInfo = {
        currencyName: 'wallacredits',
        credit: 0,
        factor: 100
      };

      expect(component.withCredits).toBe(true);
    });

    it('should return false if has not wallacredits', () => {
      component.creditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };

      expect(component.withCredits).toBe(false);
    });
  });

  describe('totalToPay', () => {

    beforeEach(() => {
      component.creditInfo = {
        currencyName: 'wallacoins',
        credit: 200,
        factor: 100
      };
      component.orderEvent = {...ORDER_EVENT} as OrderEvent;
    });

    it('should return 0 if credits to pay < user credits', () => {
      component.orderEvent.total = 1;

      expect(component.totalToPay).toBe(0);
    });

    it('should return the total to pay otherwise', () => {
      component.orderEvent.total = 5;

      expect(component.totalToPay).toBe(3);
    });
  });

  describe('hasCard', () => {
    it('should call checkout if no card', () => {
      spyOn(component, 'checkout');

      component.hasCard(false);

      expect(component.checkout).toHaveBeenCalled();
    });

    it('should set card if present', () => {
      component.hasCard(true);

      expect(component.hasFinancialCard).toBe(true);
      expect(component.mainLoading).toBe(false);
    });
  });

  describe('checkout', () => {
    let eventId: string;

    describe('success', () => {

      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        spyOn(eventService, 'emit');
        spyOn(UUID, 'UUID').and.returnValue('UUID');
        spyOn(activeModal, 'close');
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
        component.creditInfo = {
          currencyName: 'wallacoins',
          credit: 200,
          factor: 100
        };
        component.orderEvent = {...ORDER_EVENT} as OrderEvent;
      });

      it('should set localStorage with transaction amount', () => {
        component.checkout();

        expect(localStorage.setItem).toHaveBeenCalledWith('transactionSpent', '479');
      });

      it('should emit TOTAL_CREDITS_UPDATED event', () => {
        component.checkout();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED);
      });

      describe('with payment_needed true', () => {

        describe('without credit card', () => {
          it('should submit sabadell with orderId', () => {
            component.hasFinancialCard = false;

            component.checkout();

            expect(eventId).toBe('UUID');
          });
        });

        describe('with credit card', () => {

          beforeEach(() => {
            component.hasFinancialCard = true;
          });

          describe('user wants new one', () => {

            it('should submit sabadell with orderId', () => {
              component.cardType = 'new';

              component.checkout();

              expect(eventId).toBe('UUID');
            });
          });

          describe('user wants old one', () => {

            describe('payment ok', () => {
              beforeEach(() => {
                spyOn(paymentService, 'pay').and.callThrough();

                component.checkout();
              });

              it('should close with success', () => {
                expect(activeModal.close).toHaveBeenCalledWith('success');
              });
            });

            describe('payment ko', () => {
              beforeEach(() => {
                spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));

                component.checkout();
              });

              it('should close with error', () => {
                expect(activeModal.close).toHaveBeenCalledWith('error');
              });
            });

            afterEach(() => {
              it('should call pay', () => {
                expect(paymentService.pay).toHaveBeenCalledWith('UUID');
              });
            });
          });
        });
      });

      describe('with payment_needed false', () => {
        beforeEach(() => {
          spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(Observable.of({
            payment_needed: false,
            items_failed: []
          }));
          spyOn(paymentService, 'pay').and.callThrough();

          component.checkout();
        });

        it('should close with success', () => {
          expect(activeModal.close).toHaveBeenCalledWith('success');
        });
      });

    });

    describe('error', () => {
      it('should call toastr', () => {
        spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(Observable.throw({
          text() {
            return '';
          }
        }));

        component.checkout();

        it('should close with error', () => {
          expect(activeModal.close).toHaveBeenCalledWith('error');
        });
      });
    });

  });
});
