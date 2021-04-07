import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSelectOptionComponent } from './grid-select-option.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [GridSelectOptionComponent],
  exports: [GridSelectOptionComponent],
  imports: [CommonModule, SvgIconModule],
})
export class GridSelectOptionModule {}
