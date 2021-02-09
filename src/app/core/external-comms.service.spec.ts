import { TestBed } from '@angular/core/testing';

import { ExternalCommsService } from './external-comms.service';

describe('ExternalCommsService', () => {
  let service: ExternalCommsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalCommsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
