import { NgModule } from '@angular/core';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupModule } from '@public/shared/components/filters/components/filter-group/filter-group.module';
import { FilterWrapperConfigurationService } from '@public/shared/services/filter-wrapper-configuration/filter-wrapper-configuration.service';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameterStoreService } from '../../core/services/filter-parameter-store.service';
import { FiltersWrapperComponent } from './filters-wrapper.component';
import { CommonModule } from '@angular/common';
import { ExtractFilterConfigsPipe } from '@public/features/search/components/filters-wrapper/pipes/extract-filter-configs.pipe';

@NgModule({
  imports: [DrawerModule, BubbleModule, FilterGroupModule, CommonModule],
  providers: [FilterParameterDraftService, FilterParameterStoreService, FilterWrapperConfigurationService],
  declarations: [FiltersWrapperComponent, ExtractFilterConfigsPipe],
  exports: [FiltersWrapperComponent],
})
export class FiltersWrapperModule {}
