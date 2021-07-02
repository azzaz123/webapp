import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, ClickProInfo, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { APP_LOCALE } from 'configs/subdomains.config';
import { NgxPermissionsObject, NgxPermissionsService } from 'ngx-permissions';
import { take } from 'rxjs/operators';
import { FOOTER_APPS, FOOTER_LINKS, FOOTER_SOCIAL } from './constants/footer-constants';
import { FooterIcon, FooterLink, FooterLinkSection } from './interfaces/footer.interface';

@Component({
  selector: 'tsl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public currentYear = new Date().getFullYear();
  public FOOTER_LINKS: FooterLinkSection[] = FOOTER_LINKS;
  public readonly FOOTER_APPS: FooterIcon[] = FOOTER_APPS;
  public readonly FOOTER_SOCIAL: FooterIcon[] = FOOTER_SOCIAL;
  private trackingEventsConfig: { [key in ANALYTICS_EVENT_NAMES]?: { (): void } } = {
    [ANALYTICS_EVENT_NAMES.ClickProInfo]: () => this.trackClickProInfo(),
  };

  constructor(
    private analyticsService: AnalyticsService,
    private permissionService: NgxPermissionsService,
    @Inject(LOCALE_ID) private locale: APP_LOCALE
  ) {}

  ngOnInit() {
    this.permissionService.permissions$.pipe(take(1)).subscribe((permissions) => {
      let links = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
        return !(footerLinkSection.excludedLanguages || []).includes(this.locale);
      });
      links = this.filterByPermissions(permissions, links);
      this.FOOTER_LINKS = links;
    });
  }

  private filterByPermissions(permissions: NgxPermissionsObject, links: FooterLinkSection[]) {
    return links.filter((footerLinkSection: FooterLinkSection) => {
      return !footerLinkSection.permission || permissions[footerLinkSection.permission];
    });
  }

  public trackEvent(link: FooterLink): void {
    if (link.trackEvent && this.trackingEventsConfig[link.trackEvent]) {
      this.trackingEventsConfig[link.trackEvent]();
    }
  }

  private trackClickProInfo(): void {
    const event: AnalyticsEvent<ClickProInfo> = {
      name: ANALYTICS_EVENT_NAMES.ClickProInfo,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.WebHome,
        clickLocation: 'footer',
      },
    };
    return this.analyticsService.trackEvent(event);
  }
}
