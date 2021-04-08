import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesFilterComponent } from './categories-filter.component';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { GridSelectFormFormModule } from '@shared/form/components/grid-select/grid-select-form-form.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';

@NgModule({
  declarations: [CategoriesFilterComponent],
  imports: [
    CommonModule,
    AbstractFilterModule,
    GridSelectFormFormModule,
    AbstractSelectFilterModule,
    ReactiveFormsModule,
    SelectFormModule,
  ],
})
export class CategoriesFilterModule {}
