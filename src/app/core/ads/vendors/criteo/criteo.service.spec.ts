import { TestBed } from '@angular/core/testing';

import { CriteoService } from './criteo.service';

describe('CriteoService', () => {
  let service: CriteoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
