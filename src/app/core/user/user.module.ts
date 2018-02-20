import { NgModule } from '@angular/core';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShieldModule, UtilsModule } from 'shield';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { ItemModule } from '../item/item.module';

@NgModule({
  imports: [
    ShieldModule,
    SharedModule,
    MatIconModule,
    ItemModule,
    UtilsModule
  ],
  declarations: [UserAvatarComponent ],
  exports: [UserAvatarComponent]
})
export class UserModule { }
