import { TestBed } from '@angular/core/testing';

import { QueryStringServiceService } from './query-string-service.service';

describe('QueryStringServiceService', () => {
  let service: QueryStringServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryStringServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
