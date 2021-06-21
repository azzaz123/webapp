import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { SelectFormModule } from '../select/select-form.module';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

@NgModule({
  imports: [CommonModule, FormsModule, SelectFormModule, MultiSelectOptionModule],
  declarations: [MultiSelectFormComponent],
  exports: [MultiSelectFormComponent],
})
export class MultiSelectFormModule {}
