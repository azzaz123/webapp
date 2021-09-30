import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxFormModule } from '@shared/form/components/checkbox/checkbox-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MultiSelectOptionComponent } from './multi-select-option.component';

@NgModule({
  imports: [CommonModule, FormsModule, CheckboxFormModule, SvgIconModule],
  declarations: [MultiSelectOptionComponent],
  exports: [MultiSelectOptionComponent],
})
export class MultiSelectOptionModule {}
