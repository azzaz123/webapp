import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupModule } from '@public/shared/components/filters/components/filter-group/filter-group.module';
import { FiltersWrapperStubComponent } from './filters-wrapper.component.stub';

@NgModule({
  imports: [DrawerModule, BubbleModule, FilterGroupModule, CommonModule],
  declarations: [FiltersWrapperStubComponent],
  exports: [FiltersWrapperStubComponent],
})
export class FiltersWrapperStubModule {}
