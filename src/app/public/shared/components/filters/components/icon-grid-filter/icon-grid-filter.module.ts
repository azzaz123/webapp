import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridFilterComponent } from './icon-grid-filter.component';
import { GridSelectFormFormModule } from '@shared/form/components/grid-select/grid-select-form-form.module';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [IconGridFilterComponent],
  exports: [IconGridFilterComponent],
  imports: [CommonModule, GridSelectFormFormModule, AbstractFilterModule, ReactiveFormsModule],
})
export class IconGridFilterModule {}
