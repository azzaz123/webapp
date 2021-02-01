import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { StarsModule } from '@shared/stars/stars.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { UserCoverModule } from '@shared/user-cover/user-cover.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { UserBasicInfoModule } from '@public/shared/components/user-basic-info/user-basic-info.module';

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
  ],
  exports: [UserProfileHeaderComponent],
})
export class UserProfileHeaderModule {}
