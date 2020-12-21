import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { MarkAsFavouriteBodyRequest } from '../interfaces/public-profile-request.interface';
import {
  FAVOURITE_API_PATH,
  PROFILE_API_URL,
  PublicProfileService,
} from './public-profile.service';

describe('PublicProfileService', () => {
  let publicProfileService: PublicProfileService;
  let httpService: HttpTestingController;
  const USER_ID = 'USER_ID';
  const FAVOURITE_API_URL = `${environment.baseUrl}${PROFILE_API_URL}${USER_ID}/${FAVOURITE_API_PATH}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    publicProfileService = TestBed.inject(PublicProfileService);
    httpService = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(publicProfileService).toBeTruthy();
  });

  describe('when requesting isFavourite', () => {
    it('should ask server for response', () => {
      publicProfileService.isFavourite(USER_ID).subscribe();

      const req = httpService.expectOne(FAVOURITE_API_URL);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('when requesting markAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: true };

      publicProfileService.markAsFavourite(USER_ID).subscribe();

      const req = httpService.expectOne(FAVOURITE_API_URL);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });

  describe('when requesting unmarkAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: false };

      publicProfileService.unmarkAsFavourite(USER_ID).subscribe();

      const req = httpService.expectOne(FAVOURITE_API_URL);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });
});
