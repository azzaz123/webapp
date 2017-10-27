import { NgModule } from '@angular/core';
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
  declarations: [UserAvatarComponent ],
  exports: [UserAvatarComponent]
})
export class UserModule { }
