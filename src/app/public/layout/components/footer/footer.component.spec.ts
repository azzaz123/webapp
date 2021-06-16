import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { FooterComponent } from './footer.component';
import { FOOTER_LINKS } from './constants/footer-constants';
import { FooterLink, FooterLinkSection } from './interfaces/footer.interface';
import { DebugElement } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, ClickProInfo, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { NgxPermissionsService } from 'ngx-permissions';
import { MockPermissionsService, MOCK_PERMISSIONS } from '@fixtures/permissions.fixtures';
import { PERMISSIONS } from '@core/user/user-constants';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let i18nService: I18nService;
  let analyticsService: AnalyticsService;
  let permissionService: NgxPermissionsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SvgIconModule, HttpClientTestingModule],
        declarations: [FooterComponent],
        providers: [
          I18nService,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: NgxPermissionsService, useClass: MockPermissionsService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    i18nService = TestBed.inject(I18nService);
    analyticsService = TestBed.inject(AnalyticsService);
    permissionService = TestBed.inject(NgxPermissionsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have excluded links on template', () => {
    const excluded = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
      return (footerLinkSection.excludedLanguages || []).includes(i18nService.locale);
    });

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeFalsy();
      });
    });
  });

  it('should have all links except the excluded ones on template', () => {
    const excluded = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
      return !(footerLinkSection.excludedLanguages || []).includes(i18nService.locale);
    });

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeTruthy();
      });
    });
  });

  describe('and has links with permissions', () => {
    describe('and has valid permission', () => {
      it('should show link', () => {
        const included = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
          return MOCK_PERMISSIONS[footerLinkSection.permission];
        });

        included.forEach((footerLinkSection: FooterLinkSection) => {
          expect(component.FOOTER_LINKS).toContain(footerLinkSection);
        });
      });
    });

    describe('and has invalid permission', () => {
      const MOCK_LINKS: FooterLinkSection[] = [FOOTER_LINKS[0]];
      beforeEach(() => {
        MOCK_LINKS[0].permission = PERMISSIONS.professional;
      });
      it('should not show link', () => {
        const included = MOCK_LINKS.filter((footerLinkSection: FooterLinkSection) => {
          return MOCK_PERMISSIONS[footerLinkSection.permission];
        });

        included.forEach((footerLinkSection: FooterLinkSection) => {
          expect(component.FOOTER_LINKS).not.toContain(footerLinkSection);
        });
      });
    });

    describe('and has not permission set', () => {
      it('should show link', () => {
        const included = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
          return !footerLinkSection.permission && !footerLinkSection.excludedLanguages;
        });

        included.forEach((footerLinkSection: FooterLinkSection) => {
          expect(component.FOOTER_LINKS).toContain(footerLinkSection);
        });
      });
    });
  });

  describe('Tracking events', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent').and.callThrough();
    });

    describe('when link has a config tracking event', () => {
      it('should have to track the event', () => {
        const link: FooterLink = {
          label: 'test',
          href: 'test',
          trackEvent: ANALYTICS_EVENT_NAMES.ClickProInfo,
        };
        const expectedEvent: AnalyticsEvent<ClickProInfo> = {
          name: ANALYTICS_EVENT_NAMES.ClickProInfo,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.WebHome,
            clickLocation: 'footer',
          },
        };

        component.trackEvent(link);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('when link has not a tracking event', () => {
      it('should not have to track any event', () => {
        const link: FooterLink = {
          label: 'test',
          href: 'test',
        };

        component.trackEvent(link);

        expect(analyticsService.trackEvent).not.toHaveBeenCalled();
      });
    });

    describe('when link has not a config tracking event', () => {
      it('should have to track the event', () => {
        const link: FooterLink = {
          label: 'test',
          href: 'test',
          trackEvent: ANALYTICS_EVENT_NAMES.CancelSearch,
        };

        component.trackEvent(link);

        expect(analyticsService.trackEvent).not.toHaveBeenCalled();
      });
    });
  });
});
