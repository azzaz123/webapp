import { NgModule } from '@angular/core';
import { SelectParentOptionComponent } from './select-parent-option.component';
import { SelectOptionModule } from '../select-option/select-option.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SelectParentOptionComponent],
  exports: [SelectParentOptionComponent],
  imports: [SelectOptionModule, SvgIconModule, CommonModule],
})
export class SelectParentOptionModule {}
