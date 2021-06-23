import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { UserStatsComponent } from '../user-stats/user-stats.component';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [UserStatsComponent],
  imports: [CommonModule, SvgIconModule, PublicPipesModule, NgxPermissionsModule.forChild()],
  exports: [UserStatsComponent],
})
export class UserStatsModule {}
