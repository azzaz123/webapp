import { NgModule } from '@angular/core';
import { ToggleFormComponent } from './toggle-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [ToggleFormComponent],
  declarations: [ToggleFormComponent],
})
export class ToggleFormModule {}
