import { TestBed } from '@angular/core/testing';
import { UserStats } from '@data/user';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  LoadUserStats,
  LoadUserStatsByUserId,
  LoadUserStatsByUserIdFailed,
  LoadUserStatsByUserIdSuccess,
  LoadUserStatsFailed,
  LoadUserStatsSuccess,
} from 'app/data/user/actions/stats.action';
import { UserId } from 'app/data/user/domain/profile/user-id';
import { USER_STATS_REPOSITORY_TOKEN } from 'app/data/user/domain/stats/user-stats.repository';
import { UserStatsEffect } from 'app/data/user/store/effects/user-stats.effect';
import { Observable, of, throwError } from 'rxjs';
import { UserStatsMother } from '../../domain/stats/user-stats.mother';
import { UserIdMother } from './../../domain/profile/user-id.mother';
describe('Stats Effect', () => {
  let actions$: Observable<Action> = new Observable<Action>();
  let statsEffects: UserStatsEffect;
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = {
      getStats: () => of(null),
      getByUserId: () => of(null),
    };

    TestBed.configureTestingModule({
      providers: [
        UserStatsEffect,
        provideMockActions(() => actions$),
        {
          provide: USER_STATS_REPOSITORY_TOKEN,
          useValue: repositoryMock,
        },
      ],
    });

    statsEffects = TestBed.inject(UserStatsEffect);
  });

  describe('loadUserStats', () => {
    it('should use the repository to get states', () => {
      const stats: UserStats = UserStatsMother.random();
      spyOn(repositoryMock, 'getStats').and.returnValue(of(stats));

      actions$ = of(LoadUserStats());

      statsEffects.loadUserStats$.subscribe();
      expect(repositoryMock.getStats).toHaveBeenCalledTimes(1);
    });

    it('should get user stats when emit load user stats', () => {
      const stats: UserStats = UserStatsMother.random();
      spyOn(repositoryMock, 'getStats').and.returnValue(of(stats));

      actions$ = of(LoadUserStats());

      statsEffects.loadUserStats$.subscribe((action) => {
        expect(action).toEqual(LoadUserStatsSuccess({ stats }));
      });
    });

    it('should return load failed if repository fails', () => {
      spyOn(repositoryMock, 'getStats').and.returnValue(throwError(''));

      actions$ = of(LoadUserStats());

      statsEffects.loadUserStats$.subscribe({
        error: (action) => expect(action).toEqual(LoadUserStatsFailed()),
      });
    });
  });

  describe('LoadUserStatsByUserId', () => {
    it('should use repository getStats', () => {
      const stats: UserStats = UserStatsMother.random();
      const userId: UserId = UserIdMother.random();
      spyOn(repositoryMock, 'getByUserId').and.returnValue(of(stats));

      actions$ = of(LoadUserStatsByUserId({ userId }));

      statsEffects.loadUserStatsByUserId$.subscribe();
      expect(repositoryMock.getByUserId).toHaveBeenCalledTimes(1);
    });

    it('should get user stats when emit load user stats', () => {
      const stats: UserStats = UserStatsMother.random();
      const userId: UserId = UserIdMother.random();
      spyOn(repositoryMock, 'getByUserId').and.returnValue(of(stats));

      actions$ = of(LoadUserStatsByUserId({ userId }));

      statsEffects.loadUserStats$.subscribe((action) => {
        expect(action).toEqual(LoadUserStatsByUserIdSuccess({ stats }));
      });
    });

    it('should return load failed if repository fails', () => {
      const userId: UserId = UserIdMother.random();
      spyOn(repositoryMock, 'getByUserId').and.returnValue(throwError(''));

      actions$ = of(LoadUserStatsByUserId({ userId }));

      statsEffects.loadUserStats$.subscribe({
        error: (action) => expect(action).toEqual(LoadUserStatsByUserIdFailed()),
      });
    });
  });
});
