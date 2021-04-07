import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridCheckBoxFormComponent } from './icon-grid-check-box-form.component';
import { GridSelectOptionModule } from './grid-select-option/grid-select-option.module';

@NgModule({
  declarations: [IconGridCheckBoxFormComponent],
  exports: [IconGridCheckBoxFormComponent],
  imports: [CommonModule, GridSelectOptionModule],
})
export class IconGridCheckBoxFormModule {}
