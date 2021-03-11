import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsApiService } from './filter-options-api.service';
import { FilterOptionsMapperService } from './filter-options-mapper.service';
import { FilterOptionService } from './filter-option.service';

@NgModule({
  providers: [FilterOptionsApiService, FilterOptionsMapperService, FilterOptionService],
  imports: [CommonModule],
})
export class FilterOptionServiceModule {}
