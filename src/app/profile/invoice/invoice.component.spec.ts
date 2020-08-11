import { of as observableOf, throwError as observableThrowError, throwError } from 'rxjs';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { PaymentService } from 'app/core/payments/payment.service';
import { InvoiceComponent } from './invoice.component';
import { BILLING_INFO_RESPONSE } from '../../../tests/payments.fixtures.spec';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PaymentService, useValue: {
            getBillingInfo() {
              return observableOf({});
            }
          }
        }
      ],
      imports: [NgbModule],
      declarations: [InvoiceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.get(PaymentService);
  });
  
  describe('getBillingInfo', () => {
    it('should set canDownloadInvoice to true if the user has filled in the billing info before', () => {
      spyOn(paymentService, 'getBillingInfo').and.callThrough();

      component.getBillingInfo();

      expect(component.canDownloadInvoice).toBe(true);
    });

    it('should set canDownloadInvoice to false if the user has not filled in the billing info before', () => {
      spyOn(paymentService, 'getBillingInfo').and.returnValue(throwError({}));

      component.getBillingInfo();

      expect(component.canDownloadInvoice).toBe(false);
    });
  });


});
