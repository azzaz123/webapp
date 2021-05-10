import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProBadgeComponent } from './pro-badge.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [ProBadgeComponent],
  exports: [ProBadgeComponent],
})
export class ProBadgeModule {}
