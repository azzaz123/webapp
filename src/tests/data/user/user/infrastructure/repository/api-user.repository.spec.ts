import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User, UserUpdate } from '@data/user';
import { ApiUserRepository } from 'app/data/user/user/infrastructure/repository/api-user.repository';
import { UserUpdateMother } from './../../domain/user-update.mother';
import { UserMother } from './../../domain/user.mother';




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

      const user: User = UserMother.random()

      repository.getById(user.id).subscribe((response: User) => {
        expect(response).toEqual(user);
      });

      const req = httpTestingController.expectOne(
        `${ApiUserRepository.USER_BASE_ENDPOINT}/${user.id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(user);
    });
  });

  describe('getMyProfile', () => {

    it('should make a get to my profile and return my user', () => {
      const user: User = UserMother.random();

      repository.getMyProfile().subscribe((response: User) => {
        expect(response).toEqual(user);
      });

      const req = httpTestingController.expectOne(ApiUserRepository.USER_PROFILE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(user);
    });

  });

  describe('updateEmail', () => {
    it('should make a post to update email', () => {
      repository.updateEmail('newEmail@email.com').subscribe();

      const req = httpTestingController.expectOne(ApiUserRepository.UPDATE_EMAIL_URL);
      expect(req.request.method).toBe('POST');
      req.flush({})
    });
  });

  describe('updatePassword', () => {
   it('should make a post to update password and return void', () => {
     repository.updatePassword('password', 'password').subscribe();

     const req = httpTestingController.expectOne(ApiUserRepository.UPDATE_PASSWORD_URL);
     expect(req.request.method).toBe('POST');
     req.flush({});
   });
  });

  describe('updateProfile', () => {
    it('should make a post to update profile', () => {
      const userUpdate: UserUpdate = UserUpdateMother.random()
      const user: User= UserMother.random({firstName: userUpdate.first_name, lastName: userUpdate.last_name, gender: userUpdate.gender})


      repository.updateProfile(userUpdate).subscribe((response: User) => {
        expect(response).toEqual(user)
      });

      const req = httpTestingController .expectOne(ApiUserRepository.USER_PROFILE_URL);
      expect(req.request.method).toBe('POST');
      req.flush(user)
    })
  })

  describe('sendUserPresence', () => {
    it('should make a post to set online user', () => {
      repository.sendUserPresence().subscribe();

      const req = httpTestingController.expectOne(ApiUserRepository.PRESENCE_ONLINE_URL);
      expect(req.request.method).toBe('POST');
      req.flush({})
    });
  });
});
