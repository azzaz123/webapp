import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_EMAIL_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/email-verification.fixtures.spec';
import { MOCK_PHONE_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { MOCK_USER_VERIFICATIONS_API_RESPONSE } from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { VERIFICATION_TYPE } from '../dtos/requests';
import { EmailVerificationApi, UserVerificationsApi } from '../dtos/responses';
import { PhoneVerificationApi } from '../dtos/responses/phone-verification-api.interface';
import { EXTRA_INFO_ENDPOINT, SEND_VERIFY_EMAIL_ENDPOINT, SEND_VERIFY_PHONE_ENDPOINT } from './endpoints';

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
      const mobileNumber = '44444';
      const code = '+34';

      service.sendVerifyPhone(mobileNumber, code).subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(SEND_VERIFY_PHONE_ENDPOINT);
      req.flush(MOCK_PHONE_VERIFICATION_API_RESPONSE);

      expect(req.request.method).toBe('POST');
      expect(response).toEqual(MOCK_PHONE_VERIFICATION_API_RESPONSE);
      expect(req.request.body).toEqual({ mobileNumber, code, type: VERIFICATION_TYPE.PHONE });
    });
  });
});
