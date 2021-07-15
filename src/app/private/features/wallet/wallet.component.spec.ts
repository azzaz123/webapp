import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { KYC_BANNER_TYPES } from './components/kyc-banner/kyc-banner-constants';
import { KYCBannerComponent } from './components/kyc-banner/kyc-banner.component';
import { KYCBannerApiService } from './services/api/kyc-banner-api.service';
import { KYCBannerService } from './services/kyc-banner/kyc-banner.service';

import { WalletComponent } from './wallet.component';
import { WALLET_PATHS } from './wallet.routing.constants';

describe('WalletComponent', () => {
  const BANK_DETAILS_URL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;
  const CREDIT_CARD_FORM_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}/${WALLET_PATHS.CREDIT_CARD}`;

  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let router: Router;
  let kycBannerService: KYCBannerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [WalletComponent, KYCBannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: of(new NavigationEnd(1, CREDIT_CARD_FORM_LINK, '')),
          },
        },
        KYCBannerService,
        KYCBannerApiService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    kycBannerService = TestBed.inject(KYCBannerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user navigates through the nav links...', () => {
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

  describe('when the wallet status for the user is not need', () => {
    beforeEach(() => {
      spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(null));

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show the kyc banner', () => {
      const banner = fixture.debugElement.query(By.directive(KYCBannerComponent));

      expect(banner).toBeFalsy();
    });
  });

  describe('when the wallet status for the user is needed and defined', () => {
    beforeEach(() => {
      spyOn(kycBannerService, 'getSpecifications').and.returnValue(of(KYC_BANNER_TYPES[0]));

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the kyc banner', () => {
      const banner = fixture.debugElement.query(By.directive(KYCBannerComponent));

      expect(banner).toBeTruthy();
    });
  });
});
