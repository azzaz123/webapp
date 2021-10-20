import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { HeaderComponent } from '@shared/header/header.component';
import { NavLinksComponent } from '@shared/nav-links/nav-links.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { KYCBannerComponent } from './components/kyc-banner/kyc-banner.component';
import { WalletComponent } from './wallet.component';
import { WALLET_PATHS } from './wallet.routing.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { MOCK_KYC_PENDING_PROPERTIES } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { WalletTrackingEventService } from '@private/features/wallet/services/tracking-event/wallet-tracking-event.service';

describe('WalletComponent', () => {
  const BANK_DETAILS_URL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;
  const CREDIT_CARD_FORM_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}/${WALLET_PATHS.CREDIT_CARD}`;

  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let router: Router;
  let kycPropertiesService: KYCPropertiesService;
  let walletTrackingEventService: WalletTrackingEventService;

  const walletHelpButtonSelector = 'a';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [WalletComponent, KYCBannerComponent, NavLinksComponent, HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: of(new NavigationEnd(1, CREDIT_CARD_FORM_LINK, '')),
          },
        },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        KYCPropertiesService,
        KYCPropertiesHttpService,
        {
          provide: WalletTrackingEventService,
          useValue: {
            trackClickHelpWallet() {},
            trackClickBankDetails() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    kycPropertiesService = TestBed.inject(KYCPropertiesService);
    walletTrackingEventService = TestBed.inject(WalletTrackingEventService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user navigates through the nav links...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to the specified URL', () => {
      const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
      spyOn(router, 'navigate');

      navLinksElement.triggerEventHandler('clickedLink', BANK_DETAILS_URL);

      expect(router.navigate).toHaveBeenCalledWith([BANK_DETAILS_URL]);
    });

    describe('and the URL is a child of the nav links', () => {
      beforeEach(() => {
        const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
        spyOn(router, 'navigate');

        navLinksElement.triggerEventHandler('clickedLink', CREDIT_CARD_FORM_LINK);
      });

      it('should navigate to the child indicated URL', () => {
        expect(router.navigate).toHaveBeenCalledWith([CREDIT_CARD_FORM_LINK]);
      });

      it('should mark as selected the parent tab', () => {
        expect(component.selectedNavLinkId).toBe(component.navLinks.find((link) => link.id === BANK_DETAILS_URL).id);
      });
    });
  });

  describe('when the KYC banner for the user is not need', () => {
    beforeEach(() => {
      jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(null));
      spyOn(kycPropertiesService, 'getBannerSpecificationsFromProperties').and.returnValue(of(null));

      fixture.detectChanges();
    });

    it('should not show the banner', () => {
      const banner = fixture.debugElement.query(By.directive(KYCBannerComponent));

      expect(banner).toBeFalsy();
    });
  });

  describe('when the KYC banner for the user is needed and defined', () => {
    beforeEach(() => {
      jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(MOCK_KYC_PENDING_PROPERTIES));
      spyOn(kycPropertiesService, 'getBannerSpecificationsFromProperties').and.returnValue(of(KYC_BANNER_TYPES[0]));

      fixture.detectChanges();
    });

    it('should show the banner', () => {
      const banner = fixture.debugElement.query(By.directive(KYCBannerComponent));

      expect(banner).toBeTruthy();
    });
  });

  describe('when the user clicks the help button', () => {
    beforeEach(() => fixture.detectChanges());

    it('should open the Wallet help page', () => {
      const helpButtonRef = fixture.debugElement.query(By.css(walletHelpButtonSelector));

      expect(helpButtonRef.attributes['href']).toEqual(component.ZENDESK_WALLET_HELP_URL);
    });

    it('should track the event', () => {
      spyOn(walletTrackingEventService, 'trackClickHelpWallet');
      const helpButtonRef = fixture.debugElement.query(By.css(walletHelpButtonSelector));

      helpButtonRef.nativeElement.click();

      expect(walletTrackingEventService.trackClickHelpWallet).toHaveBeenCalledTimes(1);
    });
  });

  describe.each([
    ['any url', 0],
    [BANK_DETAILS_URL, 1],
  ])('WHEN user clicks to the navigation link', (navLinkUrl, times) => {
    it('should track the event for the bank details url', () => {
      const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
      spyOn(router, 'navigate');
      spyOn(walletTrackingEventService, 'trackClickBankDetails');

      navLinksElement.triggerEventHandler('clickedLink', navLinkUrl);

      expect(walletTrackingEventService.trackClickBankDetails).toHaveBeenCalledTimes(times);
    });
  });
});
