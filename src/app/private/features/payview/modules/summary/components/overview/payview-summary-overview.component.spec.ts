import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_ITEM } from '@fixtures/private/delivery/payview/payview-item.fixtures.spec';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PayviewSummaryOverviewComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const payviewSummary: string = '.PayviewSummary';
  const payviewSummaryClose: string = `${payviewSummary}__close`;
  const payviewSummaryHeader: string = 'tsl-payview-summary-header';
  const payviewSummaryHelp: string = '#helpLink';

  let activeModalService: NgbActiveModal;
  let component: PayviewSummaryOverviewComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewSummaryHeaderComponent, PayviewSummaryOverviewComponent, SvgIconComponent],
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

        component.deliveryMethods = MOCK_DELIVERY_BUYER_DELIVERY_METHODS;
        component.item = MOCK_PAYVIEW_ITEM;

        fixture.detectChanges();
      });

      it('should show the summary header', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding delivery method', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.deliveryMethod).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current);
      });

      it('should assign the corresponding image', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.image).toEqual(MOCK_PAYVIEW_ITEM.mainImage);
      });

      it('should assign the corresponding title', () => {
        const target = debugElement.query(By.css(payviewSummaryHeader));

        expect(target.componentInstance.title).toEqual(MOCK_PAYVIEW_ITEM.title);
      });
    });
  });
});
