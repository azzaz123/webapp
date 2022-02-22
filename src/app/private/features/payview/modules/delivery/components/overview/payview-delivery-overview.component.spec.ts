import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';

describe('PayviewDeliveryOverviewComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const payviewSummaryHelp: string = '#helpLink';

  let component: PayviewDeliveryOverviewComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryOverviewComponent, SvgIconComponent],
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
      ],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      customerHelpService = TestBed.inject(CustomerHelpService);
      spyOn(customerHelpService, 'getPageUrl').and.callThrough();

      component.payviewState = MOCK_PAYVIEW_STATE;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should assign the corresponding help link', () => {
      const target = debugElement.query(By.css(payviewSummaryHelp));

      expect((target.nativeElement as HTMLAnchorElement).href).toBe(fakeHelpUrl);
    });
  });
});
