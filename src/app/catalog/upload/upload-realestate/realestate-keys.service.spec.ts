import { TestBed, inject } from '@angular/core/testing';

import { RealestateKeysService } from './realestate-keys.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('RealestateKeysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealestateKeysService,
        I18nService,
        TEST_HTTP_PROVIDERS
      ]
    });
  });

  it('should be created', inject([RealestateKeysService], (service: RealestateKeysService) => {
    expect(service).toBeTruthy();
  }));
});
