import { TestBed } from '@angular/core/testing';
import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { CUSTOMER_HELP_SITE_BASE } from '@core/external-links/customer-help/enums/customer-help-site.enum';
import { UserService } from '@core/user/user.service';
import {
  DrawerNavigationBalanceElement,
  DrawerNavigationElement,
  DrawerNavigationSection,
  DRAWER_NAVIGATION_ELEMENTS,
  DRAWER_NAVIGATION_SECTIONS,
} from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';
import { of } from 'rxjs';

import { DrawerNavigationSectionsService } from './drawer-navigation-sections.service';

describe('DrawerNavigationSectionsService', () => {
  let service: DrawerNavigationSectionsService;
  let userService: UserService;

  const MOCK_HELP_CENTER_URL = CUSTOMER_HELP_SITE_BASE.ITALIAN;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DrawerNavigationSectionsService,
        {
          provide: CustomerHelpService,
          useValue: {
            getPageUrl: () => MOCK_HELP_CENTER_URL,
          },
        },
        {
          provide: UserService,
          useValue: {
            logout: () => of(true),
          },
        },
        {
          provide: PaymentsWalletsService,
          useValue: {
            walletBalance$: of(MOCK_MONEY),
          },
        },
      ],
    });

    userService = TestBed.inject(UserService);
    service = TestBed.inject(DrawerNavigationSectionsService);
  });

  describe('navigationSections$', () => {
    it('should contain wallet balance in the Wallet section', (done) => {
      service.navigationSections$.subscribe((sections: DrawerNavigationSection[]) => {
        const transactionElements: DrawerNavigationElement[] = sections.find(
          (section) => section.id === DRAWER_NAVIGATION_SECTIONS.TRANSACTIONS
        ).elements;
        const walletElement: DrawerNavigationBalanceElement = transactionElements.find(
          (element) => element.id === DRAWER_NAVIGATION_ELEMENTS.WALLET
        ) as DrawerNavigationBalanceElement;

        expect(walletElement.balance).toEqual(`${MOCK_MONEY.amount} ${MOCK_MONEY.currency.symbol}`);
        done();
      });
    });

    it('should contain help center link in the Help section', (done) => {
      service.navigationSections$.subscribe((sections: DrawerNavigationSection[]) => {
        const helpElements: DrawerNavigationElement[] = sections.find((section) => section.id === DRAWER_NAVIGATION_SECTIONS.HELP).elements;
        const helpElement: DrawerNavigationElement = helpElements.find((element) => element.id === DRAWER_NAVIGATION_ELEMENTS.HELP);

        expect(helpElement.href).toEqual(MOCK_HELP_CENTER_URL);
        done();
      });
    });

    it('should logout the user when clicking the logout element inside the Account/Settings section', (done) => {
      service.navigationSections$.subscribe((sections: DrawerNavigationSection[]) => {
        spyOn(userService, 'logout').and.returnValue(of(true));
        const accountElements: DrawerNavigationElement[] = sections.find(
          (section) => section.id === DRAWER_NAVIGATION_SECTIONS.ACCOUNT
        ).elements;
        const settingsElements: DrawerNavigationElement[] = accountElements.find(
          (element) => element.id === DRAWER_NAVIGATION_ELEMENTS.SETTINGS
        ).children;
        const logoutElement: DrawerNavigationElement = settingsElements.find((element) => element.id === DRAWER_NAVIGATION_ELEMENTS.LOGOUT);

        logoutElement.onClick();

        expect(userService.logout).toHaveBeenCalled();
        expect(userService.logout).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
