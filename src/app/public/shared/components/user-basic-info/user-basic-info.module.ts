import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBasicInfoComponent } from './user-basic-info.component';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [UserBasicInfoComponent],
  imports: [CommonModule, StarsModule, UserAvatarModule, NgxPermissionsModule.forChild()],
  exports: [UserBasicInfoComponent],
})
export class UserBasicInfoModule {}
