import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { User } from '../../domain/user';
import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/user.repository';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
} from './../../actions/user.action';

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
}
