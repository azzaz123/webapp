import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PayviewSummaryOverviewComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const payviewSummary: string = '.PayviewSummary';
  const payviewSummaryClose: string = `${payviewSummary}__close`;
  const payviewSummaryCostDetail: string = 'tsl-payview-summary-cost-detail';
  const payviewSummaryHeader: string = 'tsl-payview-summary-header';
  const payviewSummaryHelp: string = '#helpLink';
  const payviewSummaryPaymentMethod: string = 'tsl-payview-summary-payment-method';

  let activeModalService: NgbActiveModal;
  let component: PayviewSummaryOverviewComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PayviewSummaryCostDetailComponent,
        PayviewSummaryHeaderComponent,
        PayviewSummaryOverviewComponent,
        PayviewSummaryPaymentMethodComponent,
        SvgIconComponent,
      ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CustomerHelpService,
          useValue: {
            getPageUrl() {
              return fakeHelpUrl;
            },
          },
        },
        NgbActiveModal,
      ],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.payviewState = MOCK_PAYVIEW_STATE;

      activeModalService = TestBed.inject(NgbActiveModal);
      customerHelpService = TestBed.inject(CustomerHelpService);
      spyOn(customerHelpService, 'getPageUrl').and.callThrough();
      spyOn(activeModalService, 'close').and.callThrough();

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the close button', () => {
      const target = debugElement.query(By.css(payviewSummaryClose));

      expect(target).toBeTruthy();
    });

    it('should show the help link', () => {
      const target = debugElement.query(By.css(payviewSummaryHelp));

      expect(target).toBeTruthy();
    });

    it('should assign the corresponding help link', () => {
      const target = debugElement.query(By.css(payviewSummaryHelp));

      expect((target.nativeElement as HTMLAnchorElement).href).toBe(fakeHelpUrl);
    });

    describe('WHEN user clicks the close button', () => {
      it('should close the modal window', () => {
        const target = fixture.debugElement.query(By.css(payviewSummaryClose)).nativeElement;

        target.click();

        expect(activeModalService.close).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the item and the delivery methods have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;

        fixture.detectChanges();
      });

      it('should show the summary header', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding delivery method', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.deliveryMethod).toEqual(MOCK_PAYVIEW_STATE.delivery.methods.current);
      });

      it('should assign the corresponding image', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.image).toEqual(MOCK_PAYVIEW_STATE.item.mainImage);
      });

      it('should assign the corresponding title', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.title).toEqual(MOCK_PAYVIEW_STATE.item.title);
      });
    });

    describe('WHEN the costs and the product name have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;

        fixture.detectChanges();
      });

      it('should show the summary cost detail', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetail));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding costs', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetail));

        expect((target.componentInstance as PayviewSummaryCostDetailComponent).costs).toEqual(MOCK_PAYVIEW_STATE.costs);
      });

      it('should assign the corresponding product name', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetail));

        expect((target.componentInstance as PayviewSummaryCostDetailComponent).productName).toEqual(MOCK_PAYVIEW_STATE.item.title);
      });
    });

    describe('WHEN the preferences have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;

        fixture.detectChanges();
      });

      it('should show the summary payment method', () => {
        const target = debugElement.query(By.css(payviewSummaryPaymentMethod));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding payment method', () => {
        const target = debugElement.query(By.css(payviewSummaryPaymentMethod));

        expect((target.componentInstance as PayviewSummaryPaymentMethodComponent).paymentMethod).toEqual(
          MOCK_PAYVIEW_STATE.payment.preferences.preferences
        );
      });
    });

    describe('WHEN the item has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.item = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary header', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the delivery methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary header', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary body', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetail));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the payment preferences have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;
        component.payviewState.payment.preferences.preferences = null;

        fixture.detectChanges();
      });

      it('should not show the summary footer', () => {
        const target = debugElement.query(By.css(payviewSummaryPaymentMethod));

        expect(target).toBeFalsy();
      });
    });
  });
});
