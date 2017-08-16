import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShieldModule, UtilsModule } from 'shield';
import { SharedModule } from '../../shared/shared.module';
import { MdIconModule } from '@angular/material';
import { ItemModule } from '../item/item.module';

@NgModule({
  imports: [
    ShieldModule,
    SharedModule,
    MdIconModule,
    ItemModule,
    UtilsModule
  ],
  declarations: [UserComponent, UserAvatarComponent ],
  exports: [UserComponent, UserAvatarComponent]
})
export class UserModule { }
