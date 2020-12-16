import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

import { FooterComponent } from './footer.component';
import { FOOTER_LINKS } from './constants/footer-constants';
import { FooterLink, FooterLinkSection } from './interfaces/footer.interface';
import { DebugElement } from '@angular/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let i18nService: I18nService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SvgIconModule, HttpClientTestingModule],
        declarations: [FooterComponent],
        providers: [
          {
            provide: I18nService,
            useValue: {
              getTranslations() {},
              locale: 'en',
            },
          },
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have excluded links on template', () => {
    const excluded = FOOTER_LINKS.filter(
      (footerLinkSection: FooterLinkSection) => {
        return (footerLinkSection.excludedLanguages || []).includes(
          i18nService.locale
        );
      }
    );

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeFalsy();
      });
    });
  });

  it('should have all links except the excluded ones on template', () => {
    const excluded = FOOTER_LINKS.filter(
      (footerLinkSection: FooterLinkSection) => {
        return !(footerLinkSection.excludedLanguages || []).includes(
          i18nService.locale
        );
      }
    );

    excluded.forEach((footerLinkSection: FooterLinkSection) => {
      footerLinkSection.links.forEach((sectionLink: FooterLink) => {
        expect(el.querySelector(`[href="${sectionLink.href}"]`)).toBeTruthy();
      });
    });
  });
});
