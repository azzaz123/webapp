import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggesterFilterComponent } from './suggester-filter.component';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';

@NgModule({
  declarations: [SuggesterFilterComponent],
  exports: [SuggesterFilterComponent],
  imports: [
    CommonModule,
    FilterOptionServiceModule,
    AbstractFilterModule,
    AbstractSelectFilterModule,
    ReactiveFormsModule,
    SelectFormModule,
  ],
})
export class SuggesterFilterModule {}
