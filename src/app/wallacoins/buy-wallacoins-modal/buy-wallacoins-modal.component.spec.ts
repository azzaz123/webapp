import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { ErrorsService } from '../../core/errors/errors.service';
import { PaymentService } from '../../core/payments/payment.service';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pack } from '../../core/payments/pack';
import { UUID } from 'angular2-uuid';

describe('BuyWallacoinsModalComponent', () => {
  let component: BuyWallacoinsModalComponent;
  let fixture: ComponentFixture<BuyWallacoinsModalComponent>;
  let paymentService: PaymentService;
  let activeModal: NgbActiveModal;
  let errorService: ErrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyWallacoinsModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ErrorsService, useValue: {
          show() {
          },
          i18nError() {
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          orderExtrasProPack() {
            return Observable.of({});
          },
          pay() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyWallacoinsModalComponent);
    component = fixture.componentInstance;
    component.pack = new Pack(
      'id',
      100,
      100,
      'EUR',
      'wallacoins'
    );
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    activeModal = TestBed.get(NgbActiveModal);
    errorService = TestBed.get(ErrorsService);
  });

  describe('hasCard', () => {
    it('should set true if card exists', () => {
      component.hasCard(true);

      expect(component.hasFinancialCard).toEqual(true);
    });
  });

  describe('checkout', () => {
    let eventId: string;

    describe('already has billing info', () => {
      beforeEach(() => {
        spyOn(paymentService, 'orderExtrasProPack').and.callThrough();
        spyOn(UUID, 'UUID').and.returnValue('UUID');
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
      });

      it('should call paymentService orderExtrasProPack method to create a pack order', () => {
        component.checkout();

        expect(paymentService.orderExtrasProPack).toHaveBeenCalledWith({
          id: 'UUID',
          packs: ['id'],
          origin: 'WEB'
        });
      });

      describe('if paymentService OrderExtrasProPack is successful', () => {
        beforeEach(() => {
          //spyOn(trackingService, 'track');

          component.checkout();
        });

        /*it('should call track', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART, {
            selected_packs: ORDER_CART_EXTRAS_PRO.packs
          });
        });*/

        describe('buy method', () => {
          describe('should call sabadellSubmit emit', () => {
            it('if there is not financial card', () => {
              component.hasFinancialCard = null;

              component.checkout();

              expect(eventId).toBe('UUID');
            });

            it('if the cardtype is new', () => {
              component.cardType = 'new';

              component.checkout();

              expect(eventId).toBe('UUID');
            });
          });

          describe('should call paymentService pay method', () => {

            beforeEach(() => {
              component.hasFinancialCard = true;
            });

            it('if there is a financial card and cartype is old', () => {
              spyOn(paymentService, 'pay').and.callThrough();

              component.checkout();

              expect(paymentService.pay).toHaveBeenCalledWith('UUID');
            });

            it('should close modal if the payment was ok', () => {
              spyOn(paymentService, 'pay').and.callThrough();
              spyOn(activeModal, 'close');

              component.checkout();

              expect(activeModal.close).toHaveBeenCalled();
            });

            it('should show error if the payment was ko', () => {
              spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));
              spyOn(errorService, 'i18nError');

              component.checkout();

              expect(errorService.i18nError).toHaveBeenCalledWith('packError');
            });
          });

          it('should call Facebook tracking with StartTrail', () => {
            spyOn(window, 'fbq');

            component.checkout();

            expect(window['fbq']).toHaveBeenCalledWith('track', 'StartTrial');
          });
        });
      });

      describe('error', () => {
        it('should call toastr', () => {
          paymentService.orderExtrasProPack = jasmine.createSpy().and.returnValue(Observable.throw({
            text() {
              return '';
            }
          }));
          spyOn(errorService, 'i18nError');

          component.checkout();

          expect(errorService.i18nError).toHaveBeenCalledWith('packError');
        });
      });
    });

  });
});