import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShieldModule } from 'shield';
import { SharedModule } from '../../shared/shared.module';
import { MdIconModule } from '@angular/material';
import { UserTypeComponent } from './user-type/user-type.component';
import { ItemModule } from '../item/item.module';

@NgModule({
  imports: [
    ShieldModule,
    SharedModule,
    MdIconModule,
    ItemModule
  ],
  declarations: [UserComponent, UserAvatarComponent, UserTypeComponent ]
})
export class UserModule { }
