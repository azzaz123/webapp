import { NgModule } from '@angular/core';
import { SelectOptionComponent } from './select-option.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SvgIconModule, CommonModule],
  declarations: [SelectOptionComponent],
  exports: [SelectOptionComponent],
})
export class SelectOptionModule {}
