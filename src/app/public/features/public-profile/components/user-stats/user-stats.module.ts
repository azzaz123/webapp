import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { UserStatsComponent } from '../user-stats/user-stats.component';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';

@NgModule({
  declarations: [UserStatsComponent],
  imports: [CommonModule, SvgIconModule, PublicPipesModule],
  exports: [UserStatsComponent],
})
export class UserStatsModule {}
