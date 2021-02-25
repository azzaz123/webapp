import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterGroupComponent } from './ filter-group.component';

@NgModule({
  declarations: [FilterGroupComponent],
  imports: [CommonModule],
  exports: [FilterGroupComponent],
})
export class FilterGroupModule {}
