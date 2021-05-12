import { TestBed } from '@angular/core/testing';

import { SearchNavigatorService } from './search-navigator.service';

describe('SearchNavigatorService', () => {
  let service: SearchNavigatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchNavigatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
