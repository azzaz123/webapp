import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserVerifications, VERIFICATION_STATUS } from '@api/core/model/verifications';
import { MOCK_EMAIL_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/email-verification.fixtures.spec';
import {
  MOCK_PHONE_NUMBER,
  MOCK_PHONE_VERIFICATION_API_RESPONSE,
  MOCK_PREFIX_PHONE,
} from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
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
      service.getVerifications().subscribe();

      expect(userVerificationsHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: UserVerifications;

      service.getVerifications().subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_USER_VERIFICATIONS_MAPPED));
    });
  });

  describe('when request to send the email to verify', () => {
    beforeEach(() => {
      spyOn(userVerificationsHttpService, 'sendVerifyEmail').and.returnValue(of(MOCK_EMAIL_VERIFICATION_API_RESPONSE));
    });

    it('should call the post verify email ', () => {
      service.verifyEmail().subscribe();

      expect(userVerificationsHttpService.sendVerifyEmail).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: VERIFICATION_STATUS;

      service.verifyEmail().subscribe((data) => (response = data));

      expect(response).toEqual(VERIFICATION_STATUS.SENT);
    });
  });

  describe('when request to send the phone to verify', () => {
    let phone = MOCK_PHONE_NUMBER;
    let prefix = MOCK_PREFIX_PHONE;

    beforeEach(() => {
      spyOn(userVerificationsHttpService, 'sendVerifyPhone').and.returnValue(of(MOCK_PHONE_VERIFICATION_API_RESPONSE));
    });

    it('should call the post verify phone ', () => {
      service.verifyPhone(prefix + phone).subscribe();

      expect(userVerificationsHttpService.sendVerifyPhone).toHaveBeenCalledWith(prefix + phone);
    });

    it('should map server response to web context', () => {
      let response: VERIFICATION_STATUS;

      service.verifyPhone(prefix + phone).subscribe((data) => (response = data));

      expect(response).toEqual(VERIFICATION_STATUS.SENT);
    });
  });

  describe('when request to send the sms code to verify', () => {
    let smsCode = '11111';

    beforeEach(() => {
      spyOn(userVerificationsHttpService, 'sendVerifyUserIdentity').and.returnValue(of(MOCK_PHONE_VERIFICATION_API_RESPONSE));
    });

    it('should call the post verify user identity ', () => {
      service.verifySmsCode(smsCode).subscribe();

      expect(userVerificationsHttpService.sendVerifyUserIdentity).toHaveBeenCalledWith(smsCode);
    });

    it('should map server response to web context', () => {
      let response: VERIFICATION_STATUS;

      service.verifySmsCode(smsCode).subscribe((data) => (response = data));

      expect(response).toEqual(VERIFICATION_STATUS.SENT);
    });
  });

  describe('when request to change password', () => {
    let email = 'test@test.com';

    beforeEach(() => {
      spyOn(userVerificationsHttpService, 'passwordRecovery').and.returnValue(of({}));
    });

    it('should call the post password recovery', () => {
      service.changePassword(email).subscribe();

      expect(userVerificationsHttpService.passwordRecovery).toHaveBeenCalledWith(email);
    });
  });
});
