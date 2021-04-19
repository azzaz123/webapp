import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FiltersModule } from '../../filters.module';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterGroupComponent } from './filter-group.component';
import { FilterHostComponent } from './components/filter-host/filter-host.component';
import { FilterValuesPipe } from './pipes/filter-values.pipe';

@NgModule({
  declarations: [FilterGroupComponent, FilterHostDirective, FilterHostComponent, FilterValuesPipe],
  exports: [FilterGroupComponent],
  imports: [CommonModule, FiltersModule],
})
export class FilterGroupModule {}
