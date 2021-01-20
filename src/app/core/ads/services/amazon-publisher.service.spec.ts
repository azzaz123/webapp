import { TestBed } from '@angular/core/testing';

import { AmazonPublisherService } from './amazon-publisher.service';

describe('AmazonPublisherService', () => {
  let service: AmazonPublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmazonPublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
