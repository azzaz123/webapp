import { of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { STRIPE_CARD_OPTION } from '@fixtures/stripe.fixtures.spec';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '@shared/pipes';
import { CartComponent } from './cart.component';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { MOCK_ITEMS_TO_BUY_FREE, MOCK_ITEMS_TO_BUY_WITHOUT_FREE } from '@fixtures/visibility.fixtures.spec';
import { PACKS_TYPES } from '@core/payments/pack';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let errorService: ErrorsService;
  let visibilityService: VisibilityApiService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgbButtonsModule],
        declarations: [CartComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
              show() {},
            },
          },
          {
            provide: VisibilityApiService,
            useValue: {
              buyBumps() {
                return of([true]);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorsService);
    visibilityService = TestBed.inject(VisibilityApiService);
    component.creditInfo = {
      currencyName: PACKS_TYPES.WALLACREDITS,
      credit: 20,
      factor: 1,
    };
    fixture.detectChanges();
  });

  describe('hasCard', () => {
    it('should set true if stripe card exists', () => {
      component.setHasCards(true);

      expect(component.hasSavedCards).toEqual(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.setHasCards(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.setHasCards(false);

      expect(component.addNewCard).toHaveBeenCalledTimes(1);
    });
  });

  describe('addNewCard', () => {
    it('should set showCard to true', () => {
      component.addNewCard();

      expect(component.isNewCard).toEqual(true);
    });
    it('should clear card', () => {
      component.addNewCard();

      expect(component.card).toEqual(null);
    });
  });

  describe('setSavedCard', () => {
    it('should setCardInfo', () => {
      spyOn(component, 'setCardInfo').and.callThrough();

      component.setSavedCard(STRIPE_CARD_OPTION);

      expect(component.setCardInfo).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    });
  });

  describe('checkout', () => {
    it('should not proceed if loading', () => {
      spyOn(visibilityService, 'buyBumps').and.callThrough();
      component.loading = true;

      component.checkout();

      expect(visibilityService.buyBumps).not.toHaveBeenCalled();
    });

    describe('success', () => {
      beforeEach(() => {
        component.loading = false;
      });

      it('should emit event', fakeAsync(() => {
        spyOn(component.confirmAction, 'emit').and.callThrough();
        component.checkout();
        tick();

        expect(component.confirmAction.emit).toBeCalledTimes(1);
        expect(component.confirmAction.emit).toHaveBeenCalledWith();
      }));
    });

    describe('error', () => {
      beforeEach(() => {
        spyOn(visibilityService, 'buyBumps').and.returnValue(of([{ hasError: true }]));
        spyOn(component.errorAction, 'emit').and.callThrough();

        component.loading = false;
      });

      it('should emit error', fakeAsync(() => {
        component.checkout();

        expect(component.errorAction.emit).toBeCalledTimes(1);
        expect(component.errorAction.emit).toHaveBeenCalledWith([{ hasError: true }]);
      }));
    });
  });

  describe('totalToPay', () => {
    beforeEach(() => {
      component.selectedItems = MOCK_ITEMS_TO_BUY_WITHOUT_FREE;
    });

    describe('and has not items', () => {
      beforeEach(() => {
        component.selectedItems = [];
        fixture.detectChanges();
      });
      it('should return 0', () => {
        expect(component.totalToPay).toBe(0);
      });
    });

    describe('and has not items', () => {
      beforeEach(() => {
        component.creditInfo = null;
        fixture.detectChanges();
      });
      it('should return 0', () => {
        expect(component.totalToPay).toBe(0);
      });
    });

    describe('and items all items free', () => {
      beforeEach(() => {
        component.creditInfo = null;
        fixture.detectChanges();
      });
      it('should return 0', () => {
        expect(component.totalToPay).toBe(0);
      });
    });

    describe('and items all items free', () => {
      beforeEach(() => {
        component.selectedItems = MOCK_ITEMS_TO_BUY_FREE;
        fixture.detectChanges();
      });
      it('should return 0', () => {
        expect(component.totalToPay).toBe(0);
      });
    });

    describe('and no free items', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      describe('and has credits', () => {
        describe('and credits is less than total to pay', () => {
          it('should return total to pay less credits', () => {
            expect(component.totalToPay).toBe(
              component.selectedItems.reduce((a, b) => +b.duration.market_code + a, 0) - component.creditInfo.credit
            );
          });
        });
        describe('and credits is more than total to pay', () => {
          beforeEach(() => {
            component.creditInfo.credit = 200;
          });
          it('should return total to pay less credits', () => {
            expect(component.totalToPay).toBe(0);
          });
        });
      });
      describe('and has no credits', () => {
        beforeEach(() => {
          component.creditInfo.credit = 0;
        });
        it('should return total to pay', () => {
          expect(component.totalToPay).toBe(component.selectedItems.reduce((a, b) => +b.duration.market_code + a, 0));
        });
      });
    });
  });
});
