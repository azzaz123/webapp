import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MultiSelectOptionComponent } from './multi-select-option.component';

@NgModule({
  imports: [FormsModule, SvgIconModule],
  declarations: [MultiSelectOptionComponent],
  exports: [MultiSelectOptionComponent],
})
export class MultiSelectOptionModule {}
