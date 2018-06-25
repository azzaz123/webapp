import { TestBed, inject } from '@angular/core/testing';

import { RealestateKeysService } from './realestate-keys.service';

describe('RealestateKeysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealestateKeysService]
    });
  });

  it('should be created', inject([RealestateKeysService], (service: RealestateKeysService) => {
    expect(service).toBeTruthy();
  }));
});
