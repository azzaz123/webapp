import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { StarsModule } from '@shared/stars/stars.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { UserCoverModule } from '@shared/user-cover/user-cover.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { UserBasicInfoModule } from '@public/shared/components/user-basic-info/user-basic-info.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { NgxPermission } from 'ngx-permissions/lib/model/permission.model';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [UserProfileHeaderComponent],
  imports: [
    CommonModule,
    UserCoverModule,
    UserAvatarModule,
    StarsModule,
    SvgIconModule,
    UserStatsModule,
    UserBasicInfoModule,
    ProBadgeModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [UserProfileHeaderComponent],
})
export class UserProfileHeaderModule {}
