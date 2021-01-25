import { TestBed } from '@angular/core/testing';

import { AdsResolver } from './ads.resolver';

describe('AdsResolver', () => {
  let resolver: AdsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AdsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
