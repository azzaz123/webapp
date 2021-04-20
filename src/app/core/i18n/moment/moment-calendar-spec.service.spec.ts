import { TestBed } from '@angular/core/testing';
import { I18nService } from '../i18n.service';
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
import { CALENDAR_SPEC_TYPE } from './enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from './moment-calendar-spec.service';

describe('MomentCalendarSpecService', () => {
  let service: MomentCalendarSpecService;
  let i18nService: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService],
    });
    service = TestBed.inject(MomentCalendarSpecService);
    i18nService = TestBed.inject(I18nService);
  });

  describe('when the webapp is in Spanish', () => {
    beforeEach(() => jest.spyOn(i18nService, 'locale', 'get').mockReturnValue('es'));

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
    beforeEach(() => jest.spyOn(i18nService, 'locale', 'get').mockReturnValue('en'));

    describe('and when asking for default date format', () => {
      it('should get the English localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });

    describe('and when asking for days date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

        expect(result).toBe(daysEnglishCalendarSpec);
      });
    });

    describe('and when asking for short date format', () => {
      it('should get the Spanish localized date format', () => {
        const result = service.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

        expect(result).toBe(shortEnglishCalendarSpec);
      });
    });
  });

  describe('when the webapp is in a language that is not supported by this service', () => {
    beforeEach(() => jest.spyOn(i18nService, 'locale', 'get').mockReturnValue('jp'));

    describe('and when asking for default date format', () => {
      it('should get the English localized date format', () => {
        const result = service.getCalendarSpec();

        expect(result).toBe(defaultEnglishCalendarSpec);
      });
    });
  });
});
