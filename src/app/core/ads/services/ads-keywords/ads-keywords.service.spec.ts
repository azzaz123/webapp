import { TestBed } from '@angular/core/testing';

import { AdsKeywordsService } from './ads-keywords.service';

describe('AdsKeywordsService', () => {
  let service: AdsKeywordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsKeywordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
