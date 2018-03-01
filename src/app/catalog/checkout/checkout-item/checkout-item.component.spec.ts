import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { ITEMS_WITH_PRODUCTS } from '../../../../tests/item.fixtures';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutItemComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutItemComponent);
    component = fixture.componentInstance;
    component.itemWithProducts = ITEMS_WITH_PRODUCTS[0];
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set durations and default selectedDuration', () => {
      expect(component.durations).toEqual(['24', '72', '168']);
      expect(component.selectedDuration).toEqual('72');
    });
  });
});
