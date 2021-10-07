import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserVerifications } from '@api/core/model/verifications';
import {
  MOCK_USER_VERIFICATIONS_MAPPED,
  MOCK_USER_VERIFICATIONS_API_RESPONSE,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { of } from 'rxjs';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';

import { UserVerificationsService } from './user-verifications.service';

describe('UserVerificationsService', () => {
  let service: UserVerificationsService;
  let userVerificationsHttpService: UserVerificationsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserVerificationsService, UserVerificationsHttpService],
    });
    service = TestBed.inject(UserVerificationsService);
    userVerificationsHttpService = TestBed.inject(UserVerificationsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get user verifications', () => {
    beforeEach(() => {
      spyOn(userVerificationsHttpService, 'get').and.returnValue(of(MOCK_USER_VERIFICATIONS_API_RESPONSE));
    });

    it('should retrieve all the verifications', () => {
      service.userVerifications$.subscribe();

      expect(userVerificationsHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: UserVerifications;

      service.userVerifications$.subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_USER_VERIFICATIONS_MAPPED));
    });
  });
});
