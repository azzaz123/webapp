import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectFormComponent } from './multi-select-form.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MultiSelectFormComponent],
  exports: [MultiSelectFormComponent],
})
export class MultiSelectFormModule {}
