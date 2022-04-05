import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import {
  ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_MAPPED,
  ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_NO_PRODUCTS_MAPPED,
  ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED,
  MOCK_BUMPS_PACKAGE_BALANCE_MAPPED,
  MOCK_BUMPS_PACKAGE_BALANCE_MAPPED_COMPLETED,
} from '@fixtures/bump-package.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED } from '@fixtures/subscriptions.fixtures.spec';
import { By } from '@angular/platform-browser';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { MOCK_CREDIT_INFO } from '@fixtures/payments.fixtures.spec';
import { cloneDeep } from 'lodash';
import { ToggleFormComponent } from '@shared/form/components/toggle/toggle-form.component';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { FormsModule } from '@angular/forms';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;
  let modalService: NgbModal;
  let componentInstance: any = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutItemComponent, CustomCurrencyPipe, ToggleFormComponent],
        imports: [ToggleFormModule, FormsModule],
        providers: [
          DecimalPipe,
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutItemComponent);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
    component.itemWithProducts = ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0];
    component.creditInfo = MOCK_CREDIT_INFO;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    describe('should default products', () => {
      describe('and has not free products', () => {
        it('should set default products', () => {
          expect(component.availableTypes).toEqual(component.itemWithProducts.products);
          expect(component.selectedType).toEqual(component.itemWithProducts.products[0]);
          expect(component.availableDurations).toEqual(component.selectedType.durations);
          expect(component.selectedDuration).toEqual(component.selectedType.durations[component.selectedType.default_duration_index]);
        });
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should call select method when creditInfo is changed and select value is not defined', fakeAsync(() => {
      spyOn(component, 'selectType').and.callThrough();
      component.creditInfo = {
        currencyName: 'yens',
        credit: 420,
        factor: 1337,
      };
      component.selectedType = null;

      component.ngOnChanges();
      tick();
      fixture.detectChanges();

      expect(component.selectType).toHaveBeenCalledTimes(1);
      expect(component.selectType).toHaveBeenCalledWith(component.itemWithProducts.products[0]);
      expect(component.selectedType).toBe(component.itemWithProducts.products[0]);
    }));
  });

  describe('select type', () => {
    beforeEach(() => {
      component.availableDurations = component.selectedType.durations;
      component.selectType(component.availableTypes[0]);
    });

    it('should set type and duration', () => {
      expect(component.selectedType).toBe(component.availableTypes[0]);
      expect(component.selectedDuration).toBe(component.selectedType.durations[component.selectedType.default_duration_index]);
    });
  });

  describe('free option', () => {
    describe('and has no subscription', () => {
      it('should no show toggle', () => {
        const toggle = fixture.debugElement.query(By.css('.CheckoutItem__subscription'));

        expect(toggle).toBeFalsy();
      });
    });
    describe('and subscription has subscriptions with bumps available', () => {
      beforeEach(() => {
        component.itemWithProducts.subscription = MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0];
        component.itemWithProducts.balance = MOCK_BUMPS_PACKAGE_BALANCE_MAPPED[1].balance;
      });
      it('should show toggle', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const toggle = fixture.debugElement.query(By.css('.CheckoutItem__subscription'));

        expect(toggle).toBeTruthy();
      });
    });

    describe('and subscription has subscriptions without bumps available', () => {
      beforeEach(() => {
        component.itemWithProducts.subscription = MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[1];
        component.itemWithProducts.balance = MOCK_BUMPS_PACKAGE_BALANCE_MAPPED_COMPLETED;
      });
      it('should show toggle', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const toggle = fixture.debugElement.query(By.css('.CheckoutItem__subscription'));

        expect(toggle).toBeFalsy();
      });
    });
  });

  describe('toggle item', () => {
    describe('and has not available items', () => {
      beforeEach(() => {
        component.isFreeOptionSelected = true;
        component.availableFreeBumps = 0;
        spyOn(modalService, 'open').and.callThrough();
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };
      });
      it('should show modal', () => {
        component.toggleItem();
        fixture.detectChanges();

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_limit]);
      });
      it('should unselect items', fakeAsync(() => {
        component.toggleItem();
        tick();
        fixture.detectChanges();

        expect(component.isFreeOptionSelected).toBe(false);
      }));
    });
  });

  describe('card info', () => {
    const toggleClick = () => {
      const toggleSelector = 'tsl-toggle-form input';
      fixture.debugElement.query(By.css(toggleSelector)).nativeElement.click();
    };

    describe('and has not free bumps', () => {
      it('should show item title', () => {
        const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__title')).nativeElement;

        expect(itemTitle.textContent).toEqual(component.itemWithProducts.item.title);
      });
      it('should show selected price', () => {
        const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price')).nativeElement;

        expect(itemTitle.textContent).toContain(component.selectedDuration.market_code);
      });
    });
    describe('and has free bumps with products', () => {
      beforeEach(() => {
        component.itemWithProducts = cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_MAPPED);
        component.availableFreeBumps = 10;
        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should show item title', () => {
        const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__title')).nativeElement;

        expect(itemTitle.textContent).toEqual(component.itemWithProducts.item.title);
      });
      describe('and  is free bump selected', () => {
        it('should show price discounted', () => {
          const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price--discount')).nativeElement;

          expect(itemTitle.textContent).toContain(component.selectedDuration.market_code);
        });
        it('should show 0 to pay', () => {
          const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price')).nativeElement;

          expect(itemTitle.textContent).toContain(0);
        });
        it('should show free option checked', () => {
          expect(component.isFreeOptionSelected).toBe(true);
        });
      });
      describe('and is free bump not selected', () => {
        beforeEach(() => {
          toggleClick();
          fixture.detectChanges();
        });
        it('should not show free option checked', () => {
          expect(component.isFreeOptionSelected).toBe(false);
        });
        it('should show duration buttons', () => {
          const sections = fixture.debugElement.query(By.css('.CheckoutItem__durations')).queryAll(By.css('.CheckoutItem__button'));

          expect(sections.length).toEqual(component.selectedType.durations.filter((duration) => duration.id).length);
        });
        it('should not show price discounted', () => {
          const priceDiscount = fixture.debugElement.query(By.css('.CheckoutItem__price--discount'));

          expect(priceDiscount).toBeFalsy();
        });
        it('should show 0 to pay', () => {
          const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price')).nativeElement;

          expect(itemTitle.textContent).toContain(component.selectedDuration.market_code);
        });
      });
    });
    describe('and has free bumps without products', () => {
      beforeEach(() => {
        component.itemWithProducts = cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_NO_PRODUCTS_MAPPED);
        component.availableFreeBumps = 10;
        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should show item title', () => {
        const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__title')).nativeElement;

        expect(itemTitle.textContent).toEqual(component.itemWithProducts.item.title);
      });
      describe('and  is free bump selected', () => {
        it('should show free option checked', () => {
          expect(component.isFreeOptionSelected).toBe(true);
        });
        it('should show duration buttons', () => {
          const sections = fixture.debugElement.query(By.css('.CheckoutItem__durations')).queryAll(By.css('.CheckoutItem__button'));

          expect(sections.length).toEqual(component.selectedType.durations.length);
        });
        it('should not show price discounted', () => {
          const priceDiscount = fixture.debugElement.query(By.css('.CheckoutItem__price--discount'));

          expect(priceDiscount).toBeFalsy();
        });
        it('should show 0 to pay', () => {
          const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price')).nativeElement;

          expect(itemTitle.textContent).toContain(0);
        });
      });
      describe('and is free bump not selected', () => {
        beforeEach(() => {
          toggleClick();
          fixture.detectChanges();
        });
        it('should show free option checked', () => {
          expect(component.isFreeOptionSelected).toBe(false);
        });
        it('should show duration buttons', () => {
          const sections = fixture.debugElement.query(By.css('.CheckoutItem__durations')).queryAll(By.css('.CheckoutItem__button'));

          expect(sections.length).toEqual(component.selectedType.durations.filter((duration) => duration.id).length);
        });
        it('should not show price discounted', () => {
          const priceDiscount = fixture.debugElement.query(By.css('.CheckoutItem__price--discount'));

          expect(priceDiscount).toBeFalsy();
        });
        it('should show 0 to pay', () => {
          const itemTitle: HTMLElement = fixture.debugElement.query(By.css('.CheckoutItem__price')).nativeElement;

          expect(itemTitle.textContent).toContain(component.selectedDuration.market_code);
        });
      });
    });
  });
});
