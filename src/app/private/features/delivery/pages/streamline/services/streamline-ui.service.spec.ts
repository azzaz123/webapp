import { TestBed } from '@angular/core/testing';

import { StreamlineUIService } from './streamline-ui.service';

describe('StreamlineUIService', () => {
  let service: StreamlineUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamlineUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
