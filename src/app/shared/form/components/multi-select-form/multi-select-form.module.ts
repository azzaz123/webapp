import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, FormsModule, MultiSelectOptionModule, SvgIconModule],
  declarations: [MultiSelectFormComponent],
  exports: [MultiSelectFormComponent],
})
export class MultiSelectFormModule {}
