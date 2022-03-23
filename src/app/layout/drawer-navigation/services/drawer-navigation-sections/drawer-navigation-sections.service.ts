import { Injectable } from '@angular/core';
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
import { Observable, of } from 'rxjs';

@Injectable()
export class DrawerNavigationSectionsService {
  constructor(private customerHelpService: CustomerHelpService, private userService: UserService) {}

  public get navigationSections$(): Observable<DrawerNavigationSection[]> {
    return of(Object.values(this.rawNavigationSections));
  }

  private get rawNavigationSections(): Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection> {
    return {
      [DRAWER_NAVIGATION_SECTIONS.CATALOG]: DRAWER_NAVIGATION_CATALOG_SECTION,
      [DRAWER_NAVIGATION_SECTIONS.TRANSACTIONS]: DRAWER_NAVIGATION_TRANSACTIONS_SECTION,
      [DRAWER_NAVIGATION_SECTIONS.ACCOUNT]: this.accountSection,
      [DRAWER_NAVIGATION_SECTIONS.HELP]: this.helpCenterSection,
    };
  }

  private get accountSection(): DrawerNavigationSection {
    return DRAWER_NAVIGATION_ACCOUNT_SECTION(() => this.userService.logout().subscribe());
  }

  private get helpCenterSection(): DrawerNavigationSection {
    return DRAWER_NAVIGATION_HELP_SECTION(this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.HOME));
  }
}
