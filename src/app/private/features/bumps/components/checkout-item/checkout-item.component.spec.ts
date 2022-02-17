import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED } from '@fixtures/bump-package.fixtures.spec';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutItemComponent, CustomCurrencyPipe],
        providers: [DecimalPipe],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutItemComponent);
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
});
