import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { USER_REPOSITORY_TOKEN } from './domain/user.repository';
import { ApiUserRepository } from './infrastructure/repository/api-user.repository';
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
  ],
})
export class DataUserProfileModule {}
