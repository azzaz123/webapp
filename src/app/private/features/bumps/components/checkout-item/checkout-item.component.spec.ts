import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED } from '@fixtures/subscriptions.fixtures.spec';
import { By } from '@angular/platform-browser';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;
  let modalService: NgbModal;
  let componentInstance: any = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutItemComponent, CustomCurrencyPipe],
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
    component.creditInfo = {
      currencyName: 'wallacoins',
      credit: 200,
      factor: 100,
    };
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
});
