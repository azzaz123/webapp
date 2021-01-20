import { TestBed } from '@angular/core/testing';

import { GooglePublisherTagService } from './google-publisher-tag.service';

describe('GooglePublisherTagService', () => {
  let service: GooglePublisherTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglePublisherTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
