
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateModalComponent } from './reactivate-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { MOCK_ITEM } from '../../../../../tests/item.fixtures.spec';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

describe('ReactivateModalComponent', () => {
  let component: ReactivateModalComponent;
  let fixture: ComponentFixture<ReactivateModalComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReactivateModalComponent, CustomCurrencyPipe],
      providers: [NgbActiveModal, DecimalPipe,
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return observableOf({});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {
    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(observableOf(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });

    it('should call getCreditInfo and set it with wallacredits if credit is 0', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(observableOf(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1
      });
    });
  });
});
