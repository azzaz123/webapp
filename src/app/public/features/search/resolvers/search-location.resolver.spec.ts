import { TestBed } from '@angular/core/testing';

import { SearchLocationResolver } from './search-location.resolver';

describe('SearchLocationResolver', () => {
  let resolver: SearchLocationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SearchLocationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
