import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  daysCalendarConfig as daysEnglishCalendarSpec,
  defaultCalendarSpec as defaultEnglishCalendarSpec,
  shortCalendarConfig as shortEnglishCalendarSpec,
} from './constants/calendar-specs.en';
import {
  defaultCalendarSpec as defaultSpanishCalendarSpec,
  daysCalendarConfig as daysSpanishCalendarSpec,
  shortCalendarConfig as shortSpanishCalendarSpec,
} from './constants/calendar-specs.es';
import {
  defaultCalendarSpec as defaultItalianCalendarSpec,
  daysCalendarConfig as daysItalianCalendarSpec,
  shortCalendarConfig as shorItalianCalendarSpec,
} from './constants/calendar-specs.it';
import { CALENDAR_SPEC_TYPE } from './enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from './moment-calendar-spec.service';

describe('MomentCalendarSpecService', () => {
  let service: MomentCalendarSpecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('when the webapp is in Spanish', () => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: 'es' });
      service = TestBed.inject(MomentCalendarSpecService);
    });

    describe('and when asking for default date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultSpanishCalendarSpec);
      });
    });

    describe('and when asking for days date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

        expect(result).toBe(daysSpanishCalendarSpec);
      });
    });

    describe('and when asking for short date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

        expect(result).toBe(shortSpanishCalendarSpec);
      });
    });
  });

  describe('when the webapp is in English', () => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: 'en' });
      service = TestBed.inject(MomentCalendarSpecService);
    });

    describe('and when asking for default date format', () => {
      it('should get the English localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });

    describe('and when asking for days date format', () => {
      it('should get the English localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

        expect(result).toBe(daysEnglishCalendarSpec);
      });
    });

    describe('and when asking for short date format', () => {
      it('should get the English localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

        expect(result).toBe(shortEnglishCalendarSpec);
      });
    });
  });

  describe('when the webapp is in Italian', () => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: 'it' });
      service = TestBed.inject(MomentCalendarSpecService);
    });

    describe('and when asking for default date format', () => {
      it('should get the Italian localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultItalianCalendarSpec);
      });
    });

    describe('and when asking for days date format', () => {
      it('should get the Italian localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

        expect(result).toBe(daysItalianCalendarSpec);
      });
    });

    describe('and when asking for short date format', () => {
      it('should get the Italian localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

        expect(result).toBe(shorItalianCalendarSpec);
      });
    });
  });

  describe('when the webapp is in a language that is not supported by this service', () => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: 'jp' });
      service = TestBed.inject(MomentCalendarSpecService);
    });

    describe('and when asking for default date format', () => {
      it('should get the default English localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });

    describe('and when asking for days date format', () => {
      it('should get the default English localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });

    describe('and when asking for short date format', () => {
      it('should get the default English localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });
  });
});
