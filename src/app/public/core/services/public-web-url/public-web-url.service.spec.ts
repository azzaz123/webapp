import { TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { PublicWebUrlService } from './public-web-url.service';

describe('PublicProfileService', () => {
  let publicWebService: PublicWebUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });
    publicWebService = TestBed.inject(PublicWebUrlService);
  });

  it('should be created', () => {
    expect(publicWebService).toBeTruthy();
  });
});
