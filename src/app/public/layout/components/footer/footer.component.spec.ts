import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { FooterComponent } from './footer.component';
import { FOOTER_LINKS } from './constants/footer-constants';
import { FooterLink, FooterLinkSection } from './interfaces/footer.interface';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, ClickProInfo, SCREEN_IDS } from '@core/analytics/analytics-constants';

const MOCK_LOCALE = 'en';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let analyticsService: AnalyticsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SvgIconModule, HttpClientTestingModule],
        declarations: [FooterComponent],
        providers: [
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: LOCALE_ID, useValue: MOCK_LOCALE },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have excluded links on template', () => {
    const excluded = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
      return (footerLinkSection.excludedLanguages || []).includes(MOCK_LOCALE);
    });

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeFalsy();
      });
    });
  });

  it('should have all links except the excluded ones on template', () => {
    const excluded = FOOTER_LINKS.filter((footerLinkSection: FooterLinkSection) => {
      return !(footerLinkSection.excludedLanguages || []).includes(MOCK_LOCALE);
    });

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeTruthy();
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
