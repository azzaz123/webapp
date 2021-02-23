import { TestBed } from '@angular/core/testing';

import { ReleaseVersionService } from './release-version.service';

describe('ReleaseVersionService', () => {
  let service: ReleaseVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
