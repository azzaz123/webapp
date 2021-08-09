import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

@NgModule({
  imports: [CommonModule, FormsModule, MultiSelectOptionModule],
  declarations: [MultiSelectFormComponent],
  exports: [MultiSelectFormComponent],
})
export class MultiSelectFormModule {}
