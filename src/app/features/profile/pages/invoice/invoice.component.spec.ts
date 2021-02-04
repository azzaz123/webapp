import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { BILLING_INFO_RESPONSE } from '@fixtures/payments.fixtures.spec';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from 'app/core/payments/payment.service';
import { UserService } from 'app/core/user/user.service';
import { of, throwError } from 'rxjs';
import { InvoiceComponent } from './invoice.component';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let paymentService: PaymentService;
  let userService: UserService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PaymentService,
          useValue: {
            getBillingInfo() {
              return of({});
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            isProfessional() {
              return of(true);
            },
          },
        },
      ],
      imports: [NgbModule],
      declarations: [InvoiceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(PaymentService);
    userService = TestBed.inject(UserService);
  });

  describe('when getting our billing info...', () => {
    describe('when request succeeds... ', () => {
      it('should let download invoices if you have billing info ', () => {
        spyOn(paymentService, 'getBillingInfo').and.returnValue(of(BILLING_INFO_RESPONSE));

        component.handleModalAndInvoicePermission();

        expect(component.canDownloadInvoice).toBe(true);
        expect(component.activeIds).toEqual([]);
      });

      it('should NOT let download invoices if you havent billing info', () => {
        spyOn(paymentService, 'getBillingInfo').and.callThrough();

        component.handleModalAndInvoicePermission();

        expect(component.canDownloadInvoice).toBe(false);
        expect(component.activeIds).toEqual(['custom-panel-1']);
      });
    });

    describe('when request fails... ', () => {
      it('should NOT let download invoices if the request failed', () => {
        spyOn(paymentService, 'getBillingInfo').and.returnValue(throwError({}));

        component.handleModalAndInvoicePermission();

        expect(component.canDownloadInvoice).toBe(false);
        expect(component.activeIds).toEqual(['custom-panel-1']);
      });
    });
  });

  describe('when user is NOT cardealer...', () => {
    it('should search billing information', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      spyOn(paymentService, 'getBillingInfo');

      fixture.detectChanges();
      component.ngOnInit();

      expect(paymentService.getBillingInfo).toBeCalled();
    });
  });

  describe('when user is cardealer...', () => {
    it('should NOT search billing information', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));
      spyOn(paymentService, 'getBillingInfo');

      fixture.detectChanges();
      component.ngOnInit();

      expect(paymentService.getBillingInfo).not.toBeCalled();
    });
  });
});
