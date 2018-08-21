import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentCheckboxComponent } from './urgent-checkbox.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { PaymentService } from '../../core/payments/payment.service';

describe('UrgentCheckboxComponent', () => {
  let component: UrgentCheckboxComponent;
  let fixture: ComponentFixture<UrgentCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentCheckboxComponent, CustomCurrencyPipe ],
        providers: [
          DecimalPipe,
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
    fixture = TestBed.createComponent(UrgentCheckboxComponent);
    component = fixture.componentInstance;
  });

  describe('Select urgent should', () => {
    let selected: boolean;

    it('select', () => {
      component.isUrgent = false;
      component.urgentSelected.subscribe( (b: boolean) => {
        selected = b;
      });

      component.selectUrgent();

      expect(component.isUrgent).toBe(true);
      expect(selected).toBe(true);
    });

    it('unselect', () => {
      component.isUrgent = true;
      component.urgentSelected.subscribe( (b: boolean) => {
        selected = b;
      });

      component.selectUrgent();

      expect(component.isUrgent).toBe(false);
      expect(selected).toBe(false);
    });
  });

});
