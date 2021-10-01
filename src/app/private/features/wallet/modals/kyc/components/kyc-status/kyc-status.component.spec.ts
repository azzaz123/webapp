import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYC_MODAL_STATUS_PROPERTIES } from '../../constants/kyc-modal-status-constants';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';

import { KYCStatusComponent } from './kyc-status.component';

describe('KYCStatusComponent', () => {
  const KYC_STATUS_IN_PROGRESS = KYC_MODAL_STATUS_PROPERTIES[0];
  const KYC_STATUS_ERROR = KYC_MODAL_STATUS_PROPERTIES[2];
  const linkSelector = '.KYCStatus__link';

  let component: KYCStatusComponent;
  let kycTrackingEventsService: KYCTrackingEventsService;
  let fixture: ComponentFixture<KYCStatusComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCStatusComponent, SvgIconComponent, ButtonComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: KYCTrackingEventsService,
          useValue: {
            trackViewKYCVerifyingIdentityScreen() {},
          },
        },
        CustomerHelpService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusComponent);
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('when we receive status properties...', () => {
    beforeEach(() => {
      component.properties = KYC_STATUS_IN_PROGRESS;

      fixture.detectChanges();
    });

    it('should show the title', () => {
      expect(el.querySelector('.KYCStatus__title').innerHTML).toEqual(KYC_STATUS_IN_PROGRESS.title);
    });

    it('should show the description', () => {
      expect(el.querySelector('.KYCStatus__description').innerHTML).toEqual(KYC_STATUS_IN_PROGRESS.description);
    });

    it('should show the svg with the received path', () => {
      const svg = de.query(By.directive(SvgIconComponent)).componentInstance;

      expect(svg.src).toBe(KYC_STATUS_IN_PROGRESS.svgPath);
    });

    it('should show the message CTA on the button', () => {
      const button: HTMLElement = de.query(By.directive(ButtonComponent)).nativeElement;

      expect(button.textContent).toEqual(KYC_STATUS_IN_PROGRESS.messageCTA);
    });

    describe(`and we don't need to show the link`, () => {
      it('should not show the link', () => {
        const link: DebugElement = de.query(By.css(linkSelector));

        expect(link).toBeFalsy();
      });
    });

    describe('and we need to show the zendesk link', () => {
      beforeEach(() => {
        component.properties = KYC_STATUS_ERROR;

        fixture.detectChanges();
      });

      it('should redirect to the help form page', () => {
        const CSLink: DebugElement = de.query(By.css(linkSelector));

        expect(CSLink.attributes['href']).toEqual(component.HELP_FORM_URL);
      });

      it('should show the message link correctly', () => {
        const CSLink: HTMLElement = de.query(By.css(linkSelector)).nativeElement;

        expect(CSLink.textContent).toEqual($localize`:@@kyc_failed_modal_help_link:Need help?`);
      });
    });

    describe('and we click on the button', () => {
      beforeEach(() => {
        spyOn(component.buttonClick, 'emit');
      });

      it('should emit the button click', () => {
        const button: HTMLElement = de.query(By.directive(ButtonComponent)).nativeElement;

        button.click();

        expect(component.buttonClick.emit).toBeCalledTimes(1);
      });
    });

    describe('and the kyc status is in progress', () => {
      beforeEach(() => {
        component.properties = KYC_STATUS_IN_PROGRESS;

        fixture.detectChanges();
      });

      it('should request to the KYC analytics service to track the page view event', () => {
        spyOn(kycTrackingEventsService, 'trackViewKYCVerifyingIdentityScreen');

        component.ngOnInit();

        expect(kycTrackingEventsService.trackViewKYCVerifyingIdentityScreen).toHaveBeenCalledTimes(1);
      });
    });

    describe('and the kyc status is NOT in progress', () => {
      beforeEach(() => {
        component.properties = KYC_STATUS_ERROR;

        fixture.detectChanges();
      });

      it('should NOT request to track the page view event', () => {
        spyOn(kycTrackingEventsService, 'trackViewKYCVerifyingIdentityScreen');

        component.ngOnInit();

        expect(kycTrackingEventsService.trackViewKYCVerifyingIdentityScreen).not.toHaveBeenCalled();
      });
    });
  });

  describe('when we not receive status properties', () => {
    beforeEach(() => {
      component.properties = null;

      fixture.detectChanges();
    });

    it('should not show the status information', () => {
      const container: DebugElement = de.query(By.css('.KYCStatus'));

      expect(container).toBeFalsy();
    });
  });
});
