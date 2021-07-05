import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { WALLET_PATHS } from '../wallet-routing-constants';

import { WalletComponent } from './wallet.component';

describe('WalletComponent', () => {
  const BANK_DETAILS_URL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;
  const CREDIT_CARD_FORM_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}/${WALLET_PATHS.CREDIT_CARD}`;

  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [WalletComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: of(new NavigationEnd(1, CREDIT_CARD_FORM_LINK, '')),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
});
