import { TestBed } from '@angular/core/testing';
import { PublicWebUrlService } from './public-web-url.service';

describe('PublicProfileService', () => {
  let publicWebService: PublicWebUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    publicWebService = TestBed.inject(PublicWebUrlService);
  });

  it('should be created', () => {
    expect(publicWebService).toBeTruthy();
  });
});
