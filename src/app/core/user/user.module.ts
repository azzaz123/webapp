import { NgModule } from '@angular/core';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { ItemModule } from '../item/item.module';
import { UserService } from './user.service';
import { HaversineService } from 'ng2-haversine';

@NgModule({
  imports: [
    SharedModule,
    MatIconModule,
    ItemModule
  ],
  declarations: [UserAvatarComponent ],
  exports: [UserAvatarComponent],
  providers: [
    UserService,
    HaversineService
  ]
})
export class UserModule { }
