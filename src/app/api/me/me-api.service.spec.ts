import { TestBed } from '@angular/core/testing';

import { MeApiService } from './me-api.service';

describe('MeApiService', () => {
  let service: MeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeApiService],
    });
    service = TestBed.inject(MeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
