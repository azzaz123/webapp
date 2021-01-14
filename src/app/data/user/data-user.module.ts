import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  USER_LOCATION_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from './domain';
import { ApiUserRepository } from './infrastructure/repository/api-user.repository';
import { ApiUserLocationRepository } from './infrastructure/repository/location/api-user-location.repository';
import { UserEffects } from './store/effects/user.effect';
import { KEY_FEATURE_STATE, userState } from './store/reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(KEY_FEATURE_STATE, userState),
    EffectsModule.forFeature([UserEffects]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: ApiUserRepository,
    },
    {
      provide: USER_LOCATION_REPOSITORY_TOKEN,
      useClass: ApiUserLocationRepository,
    },
  ],
})
export class DataUserModule {}
