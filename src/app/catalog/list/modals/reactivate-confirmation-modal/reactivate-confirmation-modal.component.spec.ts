
import { of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ReactivateConfirmationModalComponent } from './reactivate-confirmation-modal.component';
import { DecimalPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { EventService } from '../../../../core/event/event.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReactivateConfirmationModalComponent', () => {
  let component: ReactivateConfirmationModalComponent;
  let fixture: ComponentFixture<ReactivateConfirmationModalComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivateConfirmationModalComponent, CustomCurrencyPipe ],
      providers: [NgbActiveModal, DecimalPipe,
        EventService,
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return of({});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.inject(PaymentService);
  });

  describe('ngOnInit', () => {
    it('should call getCreditInfo and set it', fakeAsync(() => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

      component.ngOnInit();
      tick(1000);

      expect(component.creditInfo).toEqual(creditInfo);
    }));

    it('should call getCreditInfo and set it with wallacredits if credit is 0', fakeAsync(() => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

      component.ngOnInit();
      tick(1000);

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1
      });
    }));
  });
});
