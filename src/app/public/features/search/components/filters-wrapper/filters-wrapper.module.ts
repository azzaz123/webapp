import { NgModule } from '@angular/core';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupModule } from '@public/shared/components/filters/components/filter-group/filter-group.module';
import { FilterGroupConfigurationService } from '@public/shared/services/filter-group-configuration/filter-group-configuration.service';
import { FiltersWrapperComponent } from './filters-wrapper.component';
import { CommonModule } from '@angular/common';
import { ExtractFilterConfigsPipe } from '@public/features/search/components/filters-wrapper/pipes/extract-filter-configs.pipe';

@NgModule({
  imports: [DrawerModule, BubbleModule, FilterGroupModule, CommonModule],
  providers: [FilterGroupConfigurationService],
  declarations: [FiltersWrapperComponent, ExtractFilterConfigsPipe],
  exports: [FiltersWrapperComponent],
})
export class FiltersWrapperModule {}
