import { TestBed, inject } from '@angular/core/testing';

import { FeatureflagService } from './featureflag.service';

describe('FeatureflagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureflagService]
    });
  });

  it('should be created', inject([FeatureflagService], (service: FeatureflagService) => {
    expect(service).toBeTruthy();
  }));
});
