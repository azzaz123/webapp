import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrgentCheckboxComponent } from './urgent-checkbox.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { PaymentService } from '../../core/payments/payment.service';
import { CreditInfo } from '../../core/payments/payment.interface';

describe('UrgentCheckboxComponent', () => {
  let component: UrgentCheckboxComponent;
  let fixture: ComponentFixture<UrgentCheckboxComponent>;
  let paymentService: PaymentService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UrgentCheckboxComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: PaymentService,
            useValue: {
              getCreditInfo() {
                return of({});
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentCheckboxComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(PaymentService);
  });

  describe('ngOnInit', () => {
    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100,
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });
  });

  describe('Select urgent should', () => {
    let selected: boolean;

    it('select', () => {
      component.isUrgent = false;
      component.urgentSelected.subscribe((b: boolean) => {
        selected = b;
      });

      component.selectUrgent();

      expect(component.isUrgent).toBe(true);
      expect(selected).toBe(true);
    });

    it('unselect', () => {
      component.isUrgent = true;
      component.urgentSelected.subscribe((b: boolean) => {
        selected = b;
      });

      component.selectUrgent();

      expect(component.isUrgent).toBe(false);
      expect(selected).toBe(false);
    });
  });
});
