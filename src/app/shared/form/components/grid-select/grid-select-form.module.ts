import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSelectFormComponent } from './grid-select-form.component';
import { GridSelectOptionModule } from './grid-select-option/grid-select-option.module';

@NgModule({
  declarations: [GridSelectFormComponent],
  exports: [GridSelectFormComponent],
  imports: [CommonModule, GridSelectOptionModule],
})
export class GridSelectFormModule {}
