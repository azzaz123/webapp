import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Profile, UserLocation, UserUpdate } from '@data/user';
import { USER_BASE_ENDPOINT } from 'app/data/user/infrastructure/repository/api-user.constant';
import { ApiUserLocationMapper, ApiUserMapper } from 'app/data/user/infrastructure/repository/api-user.mapper';
import { ApiUserRepository } from 'app/data/user/infrastructure/repository/api-user.repository';
import { ApiUserResponse } from 'app/data/user/infrastructure/repository/api-user.response';
import { ProfileMother } from '../../domain/profile/profile.mother';
import { UserUpdateMother } from '../../domain/profile/user-update.mother';
import { ApiUserResponseMother } from './api-user.response.mother';

describe('ApiUserRepository', () => {
  let repository: ApiUserRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiUserRepository],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(ApiUserRepository);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getById', () => {
    it('should make a get user by userid and return that user', () => {
      const apiResponse: ApiUserResponse = ApiUserResponseMother.random();
      const user: Profile = ApiUserMapper.toDomain(apiResponse);
      const location: UserLocation = ApiUserLocationMapper.toDomain(apiResponse);

      repository.getById(user.id).subscribe((response: [Profile, UserLocation] ) => {
        expect(response[0]).toEqual(user);
        expect(response[1]).toEqual(location);
      });

      const req = httpTestingController.expectOne(
        `${USER_BASE_ENDPOINT}/${user.id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);
    });
  });

  describe('getMyProfile', () => {

    it('should get my profile to api server', () => {
      const apiResponse: ApiUserResponse = ApiUserResponseMother.random();
      const profile: Profile = ApiUserMapper.toDomain(apiResponse);
      const location: UserLocation = ApiUserLocationMapper.toDomain(apiResponse);

      repository.getMyProfile().subscribe((response) => {
        expect(response[0]).toEqual(profile);
        expect(response[1]).toEqual(location);
      });

      const req = httpTestingController.expectOne(ApiUserRepository.USER_PROFILE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);
    });

  });

  describe('updateEmail', () => {
    it('should update the email user to api server', () => {
      repository.updateEmail('newEmail@email.com').subscribe();

      const req = httpTestingController.expectOne(ApiUserRepository.UPDATE_EMAIL_URL);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('updatePassword', () => {
   it('should update password user to api server', () => {
     repository.updatePassword('password', 'password').subscribe();

     const req = httpTestingController.expectOne(ApiUserRepository.UPDATE_PASSWORD_URL);
     expect(req.request.method).toBe('POST');
     req.flush({});
   });
  });

  describe('updateProfile', () => {
    it('should update profile to api servier', () => {
      const userUpdate: UserUpdate = UserUpdateMother.random()
      const user: Profile = ProfileMother
        .random({firstName: userUpdate.first_name, lastName: userUpdate.last_name, gender: userUpdate.gender});


      repository.updateProfile(userUpdate).subscribe((response: Profile) => {
        expect(response).toEqual(user);
      });

      const req = httpTestingController .expectOne(ApiUserRepository.USER_PROFILE_URL);
      expect(req.request.method).toBe('POST');
      req.flush(user);
    });
  });

  describe('sendUserPresence', () => {
    it('should send that the user is online to api server', () => {
      repository.sendUserPresence().subscribe();

      const req = httpTestingController.expectOne(ApiUserRepository.PRESENCE_ONLINE_URL);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
