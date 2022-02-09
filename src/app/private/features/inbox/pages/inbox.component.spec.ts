import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { FAQS, FAQ_FEATURES } from '../core/faq.fixtures.spec';
import { HelpService } from '../core/services/help.service';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let helpService: HelpService;
  let documentObject: Document;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HelpComponent],
        providers: [
          {
            provide: HelpService,
            useValue: {
              getFaqs() {
                return of(FAQS);
              },
              getFeatures() {
                return of(FAQ_FEATURES);
              },
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              fragment: of('Perfil-6'),
            },
          },
          { provide: LOCALE_ID, useValue: 'es' },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    helpService = TestBed.inject(HelpService);
    documentObject = TestBed.inject(DOCUMENT);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  describe('ngOnInit', () => {
    it('should get and set faqs', () => {
      spyOn(helpService, 'getFaqs').and.callThrough();

      fixture.detectChanges();

      expect(helpService.getFaqs).toHaveBeenCalledWith('es');
      expect(component.faqs).toEqual(FAQS);
    });

    it('should get and set features', () => {
      spyOn(helpService, 'getFeatures').and.callThrough();

      fixture.detectChanges();

      expect(helpService.getFeatures).toHaveBeenCalledWith('es');
      expect(component.features).toEqual(FAQ_FEATURES);
    });
  });

  describe('onPageScroll', () => {
    it('should set showScrollTop to true', () => {
      const event: any = {
        target: {
          scrollTop: 500,
        },
      };

      component.onPageScroll(event);

      expect(component.showScrollTop).toBe(true);
    });

    it('should set showScrollTop to false', () => {
      const event: any = {
        target: {
          scrollTop: 200,
        },
      };

      component.onPageScroll(event);

      expect(component.showScrollTop).toBe(false);
    });
  });
});
