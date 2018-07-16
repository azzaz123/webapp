import { TestBed, inject } from '@angular/core/testing';

import { FeatureflagService } from './featureflag.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';

describe('FeatureflagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureflagService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
  });

  it('should be created', inject([FeatureflagService], (service: FeatureflagService) => {
    expect(service).toBeTruthy();
  }));
});
