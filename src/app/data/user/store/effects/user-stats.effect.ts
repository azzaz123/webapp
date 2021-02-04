import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { UserStats } from '../../domain';
import * as fromActions from './../../actions';

import { UserStatsRepository, USER_STATS_REPOSITORY_TOKEN } from './../../domain/stats/user-stats.repository';

@Injectable()
export class UserStatsEffect {
  constructor(
    @Inject(USER_STATS_REPOSITORY_TOKEN)
    private repository: UserStatsRepository,
    private actions$: Actions
  ) {}

  loadUserStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadUserStats),
      exhaustMap(() => this.repository.getStats()),
      map((stats: UserStats) => fromActions.LoadUserStatsSuccess({ stats })),
      catchError(() => of(fromActions.LoadUserStatsFailed()))
    )
  );

  loadUserStatsByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadUserStatsByUserId),
      exhaustMap(({ userId }) => this.repository.getByUserId(userId)),
      map((stats: UserStats) => fromActions.LoadUserStatsByUserIdSuccess({ stats })),
      catchError(() => of(fromActions.LoadUserStatsByUserIdFailed()))
    )
  );
}
