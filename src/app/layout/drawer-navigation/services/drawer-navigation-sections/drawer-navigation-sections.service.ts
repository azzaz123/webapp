import { Injectable } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { UserService } from '@core/user/user.service';
import {
  DRAWER_NAVIGATION_ACCOUNT_SECTION,
  DRAWER_NAVIGATION_CATALOG_SECTION,
  DRAWER_NAVIGATION_HELP_SECTION,
  DRAWER_NAVIGATION_TRANSACTIONS_SECTION,
} from '@layout/drawer-navigation/constants/drawer-navigation-sections';
import {
  DrawerNavigationSection,
  DRAWER_NAVIGATION_SECTIONS,
} from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DrawerNavigationSectionsService {
  constructor(
    private customerHelpService: CustomerHelpService,
    private userService: UserService,
    private paymentsWalletsService: PaymentsWalletsService
  ) {}

  public get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return this.rawNavigationSections$.pipe(
      map((sections: Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection>) => Object.values(sections))
    );
  }

  private get rawNavigationSections$(): Observable<Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection>> {
    return combineLatest([this.paymentsWalletsService.walletBalance$, this.userService.isProUser$]).pipe(
      map(([balance, isPro]: [Money, boolean]) => {
        return {
          [DRAWER_NAVIGATION_SECTIONS.CATALOG]: DRAWER_NAVIGATION_CATALOG_SECTION,
          [DRAWER_NAVIGATION_SECTIONS.TRANSACTIONS]: this.getTransactionsSection(balance),
          [DRAWER_NAVIGATION_SECTIONS.ACCOUNT]: this.getAccountSection(isPro),
          [DRAWER_NAVIGATION_SECTIONS.HELP]: this.getHelpCenterSection(),
        };
      })
    );
  }

  private getTransactionsSection(balance: Money): DrawerNavigationSection {
    return DRAWER_NAVIGATION_TRANSACTIONS_SECTION(`${balance.amount} ${balance.currency.symbol}`);
  }

  private getAccountSection(isPro: boolean): DrawerNavigationSection {
    return DRAWER_NAVIGATION_ACCOUNT_SECTION(() => this.userService.logout().subscribe(), isPro);
  }

  private getHelpCenterSection(): DrawerNavigationSection {
    return DRAWER_NAVIGATION_HELP_SECTION(this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.HOME));
  }
}
