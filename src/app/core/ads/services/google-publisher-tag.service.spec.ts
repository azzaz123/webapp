import { TestBed } from '@angular/core/testing';
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
          useClass: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(GooglePublisherTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
