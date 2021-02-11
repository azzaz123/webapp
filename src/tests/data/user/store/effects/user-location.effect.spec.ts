import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@core/geolocation/address-response.interface';
import {
  SetUserLocation,
  UpdateUserLocation,
  UpdateUserLocationFailed,
  UpdateUserLocationSuccess,
  UserLocation,
  USER_LOCATION_REPOSITORY_TOKEN,
} from '@data/user';
import { CoordinateMother } from '@fixtures/core';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { UserLocationEffect } from 'app/data/user/store/effects/user-location.effect';
import { Observable, of, throwError } from 'rxjs';
import { UserLocationMother } from '../../domain';
describe('User Location Effect', () => {
  let actions$ = new Observable<Action>();
  let userLocationEffect: UserLocationEffect;
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = {
      updateByCoordinates() {
        return of(null);
      },
    };

    TestBed.configureTestingModule({
      providers: [
        UserLocationEffect,
        provideMockActions(() => actions$),
        {
          provide: USER_LOCATION_REPOSITORY_TOKEN,
          useValue: repositoryMock,
        },
      ],
    });

    userLocationEffect = TestBed.inject(UserLocationEffect);
  });

  describe('updateLocation', () => {
    it('should call repository updateByCoordinates with coordenates', () => {
      const coordinate: Coordinate = CoordinateMother.random();
      const location: UserLocation = UserLocationMother.random();
      spyOn(repositoryMock, 'updateByCoordinates').and.returnValue(location);

      actions$ = of(UpdateUserLocation({ coordinate }));
      userLocationEffect.updateLocation$.subscribe();

      expect(repositoryMock.updateByCoordinates).toHaveBeenCalledWith(coordinate);
    });

    it('should emit update user location success if the repository was good', () => {
      const coordinate: Coordinate = CoordinateMother.random();
      const location: UserLocation = UserLocationMother.random();
      spyOn(repositoryMock, 'updateByCoordinates').and.returnValue(of(location));

      actions$ = of(UpdateUserLocation({ coordinate }));

      userLocationEffect.updateLocation$.subscribe((action) => {
        expect(action).toEqual(UpdateUserLocationSuccess({ location }));
      });
    });

    it('should emit update user location failed if the repository was bad', () => {
      const coordinate: Coordinate = CoordinateMother.random();
      spyOn(repositoryMock, 'updateByCoordinates').and.returnValue(throwError(''));

      actions$ = of(UpdateUserLocation({ coordinate }));

      userLocationEffect.updateLocation$.subscribe({
        error: (action) => expect(action).toEqual(UpdateUserLocationFailed()),
      });
    });
  });

  describe('updateLocationSuccess', () => {
    it('should emit set user location', () => {
      const location: UserLocation = UserLocationMother.random();

      actions$ = of(UpdateUserLocationSuccess({ location }));

      userLocationEffect.updateLocationSuccess$.subscribe((action) => {
        expect(action).toEqual(SetUserLocation({ location }));
      });
    });
  });
});
