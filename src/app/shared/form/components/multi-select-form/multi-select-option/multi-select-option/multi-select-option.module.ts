import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MultiSelectOptionComponent } from './multi-select-option.component';

@NgModule({
  imports: [SvgIconModule, CommonModule],
  declarations: [MultiSelectOptionComponent],
  exports: [MultiSelectOptionComponent],
})
export class MultiSelectOptionModule {}
