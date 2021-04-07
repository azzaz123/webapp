import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { EmptyStateComponent } from './empty-state.component';

@NgModule({
  declarations: [EmptyStateComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [EmptyStateComponent],
})
export class EmptyStateModule {}
