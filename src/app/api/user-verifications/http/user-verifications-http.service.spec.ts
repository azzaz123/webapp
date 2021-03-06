import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_EMAIL_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/email-verification.fixtures.spec';
import {
  MOCK_PHONE_NUMBER,
  MOCK_PHONE_VERIFICATION_API_RESPONSE,
  MOCK_PREFIX_PHONE,
} from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { MOCK_USER_VERIFICATIONS_API_RESPONSE } from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { VERIFICATION_TYPE } from '../dtos/requests';
import { EmailVerificationApi, UserVerificationsApi } from '../dtos/responses';
import { PhoneVerificationApi } from '../dtos/responses/phone-verification-api.interface';
import {
  EXTRA_INFO_ENDPOINT,
  PASSWORD_RECOVERY_ENDPOINT,
  SEND_VERIFY_EMAIL_ENDPOINT,
  SEND_VERIFY_PHONE_ENDPOINT,
  VERIFY_USER_ENDPOINT,
} from './endpoints';

import { UserVerificationsHttpService } from './user-verifications-http.service';

describe('UserVerificationsHttpService', () => {
  let service: UserVerificationsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserVerificationsHttpService],
    });
    service = TestBed.inject(UserVerificationsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the user verifications', () => {
    it('should retrieve the user verifications response', () => {
      let response: UserVerificationsApi;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(EXTRA_INFO_ENDPOINT);
      req.flush(MOCK_USER_VERIFICATIONS_API_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_USER_VERIFICATIONS_API_RESPONSE);
    });
  });
  describe('when asking to send the email to verify', () => {
    it('should retrieve the email verification response', () => {
      let response: EmailVerificationApi;

      service.sendVerifyEmail().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(SEND_VERIFY_EMAIL_ENDPOINT);
      req.flush(MOCK_EMAIL_VERIFICATION_API_RESPONSE);

      expect(req.request.method).toBe('POST');
      expect(response).toEqual(MOCK_EMAIL_VERIFICATION_API_RESPONSE);
      expect(req.request.body).toEqual('');
    });
  });

  describe('when asking to send the phone to verify', () => {
    it('should retrieve the phone verification response', () => {
      let response: PhoneVerificationApi;
      const phone = MOCK_PHONE_NUMBER;
      const prefix = MOCK_PREFIX_PHONE;

      service.sendVerifyPhone(prefix + phone).subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(SEND_VERIFY_PHONE_ENDPOINT);
      req.flush(MOCK_PHONE_VERIFICATION_API_RESPONSE);

      expect(req.request.method).toBe('POST');
      expect(response).toEqual(MOCK_PHONE_VERIFICATION_API_RESPONSE);
      expect(req.request.body).toEqual({ mobileNumber: prefix + phone, code: null, type: VERIFICATION_TYPE.PHONE });
    });
  });

  describe('when asking to send the sms code to verify', () => {
    it('should retrieve the phone verification response', () => {
      let response: PhoneVerificationApi;
      const smsCode = '11111';

      service.sendVerifyUserIdentity(smsCode).subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(VERIFY_USER_ENDPOINT);
      req.flush(MOCK_PHONE_VERIFICATION_API_RESPONSE);

      expect(req.request.method).toBe('POST');
      expect(response).toEqual(MOCK_PHONE_VERIFICATION_API_RESPONSE);
      expect(req.request.body).toEqual({ mobileNumber: null, code: smsCode, type: VERIFICATION_TYPE.PHONE });
    });
  });

  describe('when asking to recover the password', () => {
    it('should retrieve an empty response', (done) => {
      const email = 'test@test.com';
      let params: URLSearchParams = new URLSearchParams();
      params.append('emailAddress', email);

      service.passwordRecovery(email).subscribe(() => {
        done();
      });
      const req: TestRequest = httpMock.expectOne(PASSWORD_RECOVERY_ENDPOINT);
      req.flush('', { status: 204, statusText: '' });

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(params);
    });
  });
});
