import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { translations } from '@core/i18n/translations/constants/translations';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService],
    });
    service = TestBed.inject(I18nService);
  });

  describe('when asked for a translation', () => {
    describe('and the translation key exists', () => {
      it('should get the translation', () => {
        const translation = service.translate(TRANSLATION_KEY.ACTIVE);

        expect(translation).toEqual(translations[TRANSLATION_KEY.ACTIVE]);
      });
    });

    describe('and the translation key does not exist', () => {
      it('should return an empty string', () => {
        const translation = service.translate('nonExistingKey' as TRANSLATION_KEY);

        expect(translation).toEqual('');
      });
    });
  });
});
