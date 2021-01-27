import { TestBed } from '@angular/core/testing';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { MockAdsKeywordsService } from '@fixtures/ads.fixtures.spec';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';

import { GooglePublisherTagService } from './google-publisher-tag.service';

describe('GooglePublisherTagService', () => {
  let service: GooglePublisherTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: AdsKeywordsService,
          useValue: MockAdsKeywordsService,
        },
      ],
    });
    service = TestBed.inject(GooglePublisherTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
