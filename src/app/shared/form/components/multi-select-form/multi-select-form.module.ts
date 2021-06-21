import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { SelectFormModule } from '../select/select-form.module';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option/multi-select-option.component';

@NgModule({
  imports: [CommonModule, FormsModule, SelectFormModule],
  declarations: [MultiSelectFormComponent, MultiSelectOptionComponent],
  exports: [MultiSelectFormComponent],
})
export class MultiSelectFormModule {}
