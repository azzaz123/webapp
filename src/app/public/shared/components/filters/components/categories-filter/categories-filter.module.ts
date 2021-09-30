import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesFilterComponent } from './categories-filter.component';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormatSelectOptionsPipe } from '@public/shared/components/filters/components/categories-filter/pipes/format-select-options.pipe';
import { CategoriesApiModule } from '@api/categories/categories-api.module';

@NgModule({
  declarations: [CategoriesFilterComponent, FormatSelectOptionsPipe],
  imports: [
    CommonModule,
    AbstractFilterModule,
    GridSelectFormModule,
    AbstractSelectFilterModule,
    ReactiveFormsModule,
    SelectFormModule,
    CategoriesApiModule,
  ],
})
export class CategoriesFilterModule {}
