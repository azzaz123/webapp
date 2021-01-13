import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';

import * as fromActions from '../../actions';
import { Profile, UserRepository, USER_REPOSITORY_TOKEN } from '../../domain';

@Injectable()
export class UserEffects {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private repository: UserRepository,
    private actions$: Actions
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadUserProfile),
      exhaustMap(() => this.repository.getMyProfile()),
      mergeMap(([user, location]) => [
        fromActions.LoadUserProfileSuccess({ user }),
        fromActions.UserLocationLoaded({ location }),
      ]),
      catchError(() => of(fromActions.LoadUserProfileFailed()))
    )
  );

  updateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.SendUpdateEmail),
      exhaustMap(({ emailAddress }) =>
        this.repository.updateEmail(emailAddress)
      ),
      map(() => fromActions.SendUpdateEmailSuccess()),
      catchError(() => of(fromActions.SendUpdateEmailFailed()))
    )
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.SendUpdatePassword),
      exhaustMap(({ old_password, new_password }) =>
        this.repository.updatePassword(old_password, new_password)
      ),
      map(() => fromActions.SendUpdatePasswordSuccess()),
      catchError(() => of(fromActions.SendUpdatePasswordFailed()))
    )
  );
}
