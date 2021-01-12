import { UserMother } from './../../domain/user.mother';
import { TestBed } from '@angular/core/testing';
import { User } from '@data/user';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
} from 'app/data/user/user/actions/user.action';
import { USER_REPOSITORY_TOKEN } from 'app/data/user/user/domain/user.repository';
import { UserEffects } from 'app/data/user/user/store/effects/user.effect';
import { Observable, of, throwError } from 'rxjs';

describe('User EFfect', () => {
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
    it('should get profile when emit Load Profile', () => {
      const user: User = UserMother.random();
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
