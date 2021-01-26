import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { UpdateUserLocation } from '../../actions';
import { UserLocation, USER_LOCATION_REPOSITORY_TOKEN } from '../../domain';
import * as fromActions from './../../actions';
import { UserLocationRepository } from './../../domain/location/user-location.repository';

@Injectable()
export class UserLocationEffect {
  constructor(
    @Inject(USER_LOCATION_REPOSITORY_TOKEN)
    private repository: UserLocationRepository,
    private actions$: Actions
  ) {}

  updateLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateUserLocation),
      exhaustMap(({ coordinate }) =>
        this.repository.updateByCoordinates(coordinate)
      ),
      map((location: UserLocation) =>
        fromActions.UpdateUserLocationSuccess({ location })
      ),
      catchError(() => of(fromActions.UpdateUserLocationFailed()))
    )
  );

  updateLocationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.UpdateUserLocationSuccess),
      map(({ location }) => fromActions.SetUserLocation({ location }))
    )
  );
}
