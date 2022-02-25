import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryHeaderComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const payviewSummaryHelp: string = '#helpLink';

  let component: PayviewDeliveryHeaderComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryHeaderComponent, SvgIconComponent],
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
      fixture = TestBed.createComponent(PayviewDeliveryHeaderComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      customerHelpService = TestBed.inject(CustomerHelpService);
      spyOn(customerHelpService, 'getPageUrl').and.callThrough();

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the help link', () => {
      const target = debugElement.query(By.css(payviewSummaryHelp));

      expect(target).toBeTruthy();
    });

    it('should assign the corresponding help link', () => {
      const target = debugElement.query(By.css(payviewSummaryHelp));

      expect((target.nativeElement as HTMLAnchorElement).href).toBe(fakeHelpUrl);
    });
  });
});
