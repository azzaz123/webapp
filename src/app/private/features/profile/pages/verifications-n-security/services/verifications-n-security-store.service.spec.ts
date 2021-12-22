import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VerificationsNSecurityStore } from './verifications-n-security-store.service';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import {
  MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED,
  MOCK_USER_VERIFICATIONS_MAPPED,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';

describe('VerificationsNSecurityStore', () => {
  let store: VerificationsNSecurityStore;
  let userVerificationsService: UserVerificationsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserVerificationsService,
          useValue: {
            getVerifications() {
              return of({});
            },
          },
        },
        { provide: UserService, useClass: MockedUserService },
        { provide: VerificationsNSecurityStore },
      ],
    });
    store = TestBed.inject(VerificationsNSecurityStore);
    userService = TestBed.inject(UserService);
    userVerificationsService = TestBed.inject(UserVerificationsService);
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
  });

  describe('when User Verifications is initialized', () => {
    describe('and the phone is not verified', () => {
      beforeEach(() => {
        spyOn(userVerificationsService, 'getVerifications').and.returnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
        store.initializeUserVerifications();
      });
      it('should fullfill the user verifications', (done) => {
        store.userVerifications$.subscribe((userVerifications) => {
          expect(userVerifications).toEqual(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED);
          done();
        });
      });

      it('should fullfill the user information with an empty phone', (done) => {
        store.userInformation$.subscribe(() => {
          expect(store.userInformation).toEqual({ email: MOCK_FULL_USER.email, phone: '' });
          done();
        });
      });
    });

    describe('and the phone is verified', () => {
      beforeEach(() => {
        spyOn(userVerificationsService, 'getVerifications').and.returnValue(of(MOCK_USER_VERIFICATIONS_MAPPED));
        store.initializeUserVerifications();
      });

      it('should fullfill the user verifications', (done) => {
        store.userVerifications$.subscribe(() => {
          expect(store.userVerifications).toEqual(MOCK_USER_VERIFICATIONS_MAPPED);
          done();
        });
      });

      it('should fullfill the user information with an non empty phone number', (done) => {
        store.userInformation$.subscribe(() => {
          expect(store.userInformation).toEqual({ email: MOCK_FULL_USER.email, phone: '+34 935 50 09 96' });
          done();
        });
      });
    });
  });

  describe('when the phone is verified', () => {
    it('should set the phone number and the verification as true ', () => {
      store.verifiedPhone(MOCK_FULL_USER.phone);

      expect(store.userVerifications.phone).toBeTruthy();
      expect(store.userInformation.phone).toBe('+34 935 50 09 96');
    });
  });
});
