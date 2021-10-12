import { TestBed } from '@angular/core/testing';

import { SearchAdsResolver } from './search-ads.resolver';

describe('SearchAdsResolver', () => {
  let resolver: SearchAdsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SearchAdsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
