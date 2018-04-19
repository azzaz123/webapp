import { TestBed, inject } from '@angular/core/testing';

import { CallsService } from './calls.service';

describe('CallsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallsService]
    });
  });

  it('should be created', inject([CallsService], (service: CallsService) => {
    expect(service).toBeTruthy();
  }));
});
