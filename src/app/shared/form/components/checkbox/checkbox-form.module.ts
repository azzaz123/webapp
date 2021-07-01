import { NgModule } from '@angular/core';
import { CheckboxFormComponent } from './checkbox-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [CheckboxFormComponent],
  declarations: [CheckboxFormComponent],
})
export class CheckboxFormModule {}
