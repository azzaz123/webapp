import { USER_REPOSITORY_TOKEN } from './../domain/user.repository';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from './store/effects/user.effect';
import { userReducer } from './store/reducer/user.reducer';
import { ApiUserRepository } from './infrastructure/repository/api-user.repository';

@NgModule({
  imports: [
    StoreModule.forFeature('user', { user: userReducer }),
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
