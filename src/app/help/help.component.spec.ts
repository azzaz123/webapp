import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HelpService } from './help.service';
import { FAQ_FEATURES, FAQS } from '../../tests/faq.fixtures.spec';
import { I18nService } from '../core/i18n/i18n.service';
import { DOCUMENT } from '@angular/common';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let helpService: HelpService;
  let documentObject: Document;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpComponent],
      providers: [{
        provide: Router, useValue: {
          events: Observable.of({})
        }
      },
        {
          provide: HelpService, useValue: {
          getFaqs() {
            return Observable.of(FAQS)
          },
          getFeatures() {
            return Observable.of(FAQ_FEATURES)
          }
        }
        },
        {
          provide: I18nService, useValue: {
            locale: 'es'
        }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    helpService = TestBed.get(HelpService);
    documentObject = TestBed.get(DOCUMENT);
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

  describe('scrollTop', () => {
    it('should call scrollIntoView', () => {
      const scrollIntoViewSpy = jasmine.createSpy('scrollIntoView');
      spyOn(documentObject, 'querySelector').and.returnValue({
        scrollIntoView: scrollIntoViewSpy
      });

      component.scrollTop();

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({block: 'start', inline: 'nearest', behavior: 'smooth'});
    });
  });

  describe('onPageScroll', () => {
    it('should set showScrollTop to true', () => {
      const event: any = {
        target: {
          scrollTop: 500
        }
      };

      component.onPageScroll(event);

      expect(component.showScrollTop).toBe(true);
    });

    it('should set showScrollTop to false', () => {
      const event: any = {
        target: {
          scrollTop: 200
        }
      };

      component.onPageScroll(event);

      expect(component.showScrollTop).toBe(false);
    });
  });
});
