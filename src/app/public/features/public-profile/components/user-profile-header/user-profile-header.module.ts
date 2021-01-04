import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { StarsModule } from '@shared/stars/stars.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { UserStatsComponent } from '../user-stats/user-stats.component';
import { UserCoverModule } from '@shared/user-cover/user-cover.module';

@NgModule({
  declarations: [UserProfileHeaderComponent, UserStatsComponent],
  imports: [CommonModule, UserCoverModule, StarsModule, SvgIconModule],
  exports: [UserProfileHeaderComponent],
})
export class UserProfileHeaderModule {}
