import { TestBed } from '@angular/core/testing';

import { SearchQueryStringService } from './search-query-string.service';

describe('QueryStringServiceService', () => {
  let service: SearchQueryStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchQueryStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
