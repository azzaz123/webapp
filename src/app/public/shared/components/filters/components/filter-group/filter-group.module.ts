import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FiltersModule } from '../../filters.module';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

@NgModule({
  declarations: [FilterGroupComponent, FilterHostDirective],
  exports: [FilterGroupComponent],
  imports: [CommonModule, FiltersModule],
  providers: [FilterFactoryService],
})
export class FilterGroupModule {}
