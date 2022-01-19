import { TestBed } from '@angular/core/testing';

import { AcceptScreenService } from './accept-screen.service';

describe('AcceptScreenService', () => {
  let service: AcceptScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
