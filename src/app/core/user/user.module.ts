import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserComponent, UserAvatarComponent]
})
export class UserModule { }
