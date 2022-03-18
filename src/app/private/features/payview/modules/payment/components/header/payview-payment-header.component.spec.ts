import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PayviewPaymentHeaderComponent } from '@private/features/payview/modules/payment/components/header/payview-payment-header.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewPaymentHeaderComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const payviewPaymentHelp: string = '#helpLink';

  let component: PayviewPaymentHeaderComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPaymentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewPaymentHeaderComponent, SvgIconComponent],
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
      fixture = TestBed.createComponent(PayviewPaymentHeaderComponent);
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
      const target = debugElement.query(By.css(payviewPaymentHelp));

      expect(target).toBeTruthy();
    });

    it('should assign the corresponding help link', () => {
      const target = debugElement.query(By.css(payviewPaymentHelp));

      expect((target.nativeElement as HTMLAnchorElement).href).toBe(fakeHelpUrl);
    });
  });
});
