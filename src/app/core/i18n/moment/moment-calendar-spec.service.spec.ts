import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from '../i18n.service';
import { defaultCalendarSpec as defaultSpanishCalendarSpec } from './constants/calendar-specs.es';
import { MomentCalendarSpecService } from './moment-calendar-spec.service';

describe('MomentCalendarSpecService', () => {
  let service: MomentCalendarSpecService;
  let i18nService: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService, { provide: LOCALE_ID, useValue: 'es' }],
    });
    service = TestBed.inject(MomentCalendarSpecService);
    i18nService = TestBed.inject(I18nService);
  });

  describe('when the webapp is in Spanish', () => {
    describe('and when asking for date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultSpanishCalendarSpec);
      });
    });
  });
});
