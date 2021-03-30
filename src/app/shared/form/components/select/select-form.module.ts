import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFormComponent } from './select-form.component';
import { SelectOptionModule } from './select-option/select-option.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SelectOptionModule, FormsModule],
  declarations: [SelectFormComponent],
  exports: [SelectFormComponent],
})
export class SelectFormModule {}
