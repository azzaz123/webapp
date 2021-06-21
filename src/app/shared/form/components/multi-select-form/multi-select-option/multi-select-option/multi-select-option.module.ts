import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectOptionComponent } from './multi-select-option.component';

@NgModule({
  imports: [FormsModule],
  declarations: [MultiSelectOptionComponent],
  exports: [MultiSelectOptionComponent],
})
export class MultiSelectOptionModule {}
