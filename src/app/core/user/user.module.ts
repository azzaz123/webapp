import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ItemModule } from '../item/item.module';
import { UserService } from './user.service';
import { FeatureflagService } from './featureflag.service';

@NgModule({
  imports: [SharedModule, ItemModule],
  providers: [UserService, FeatureflagService],
})
export class UserModule {}
