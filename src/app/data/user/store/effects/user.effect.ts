import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
  SendUpdateEmail,
  SendUpdateEmailFailed,
  SendUpdateEmailSuccess,
  SendUpdatePassword,
  SendUpdatePasswordFailed,
  SendUpdatePasswordSuccess,
} from '../../actions/user.action';
import { User, UserRepository, USER_REPOSITORY_TOKEN } from '../../domain';

@Injectable()
export class UserEffects {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private repository: UserRepository,
    private actions$: Actions
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadUserProfile),
      exhaustMap(() => this.repository.getMyProfile()),
      map((user: User) => LoadUserProfileSuccess({ user })),
      catchError(() => of(LoadUserProfileFailed()))
    )
  );

  updateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SendUpdateEmail),
      exhaustMap(({ emailAddress }) =>
        this.repository.updateEmail(emailAddress)
      ),
      map(() => SendUpdateEmailSuccess()),
      catchError(() => of(SendUpdateEmailFailed()))
    )
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SendUpdatePassword),
      exhaustMap(({ old_password, new_password }) =>
        this.repository.updatePassword(old_password, new_password)
      ),
      map(() => SendUpdatePasswordSuccess()),
      catchError(() => of(SendUpdatePasswordFailed()))
    )
  );
}
