import { TestBed } from '@angular/core/testing';
import { Profile, USER_REPOSITORY_TOKEN } from '@data/user';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
} from 'app/data/user/actions/user.action';
import { UserEffects } from 'app/data/user/store/effects/user.effect';
import { Observable, of, throwError } from 'rxjs';
import { ProfileMother } from './../../domain';

describe('User Effect', () => {
  let actions$ = new Observable<Action>();
  let userEffects: UserEffects;
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = {
      getMyProfile() {
        return of(null);
      },
    };

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: repositoryMock,
        },
      ],
    });

    userEffects = TestBed.inject(UserEffects);
  });

  describe('loadUsers', () => {
    it('should call repository getMyProfile', () => {
      const user: Profile = ProfileMother.random();
      spyOn(repositoryMock, 'getMyProfile').and.returnValue(of(user));

      actions$ = of(LoadUserProfile());

      userEffects.loadUser$.subscribe();
      expect(repositoryMock.getMyProfile).toHaveBeenCalledTimes(1);
    });
    it('should get profile when emit Load Profile', () => {
      const user: Profile = ProfileMother.random();
      spyOn(repositoryMock, 'getMyProfile').and.returnValue(of(user));

      actions$ = of(LoadUserProfile());

      userEffects.loadUser$.subscribe((action) => {
        expect(action).toEqual(LoadUserProfileSuccess({ user }));
      });
    });

    it('should return load failed if repository fails', () => {
      spyOn(repositoryMock, 'getMyProfile').and.returnValue(throwError(''));

      actions$ = of(LoadUserProfile());

      userEffects.loadUser$.subscribe({
        error: (action) => expect(action).toEqual(LoadUserProfileFailed()),
      });
    });
  });
});
