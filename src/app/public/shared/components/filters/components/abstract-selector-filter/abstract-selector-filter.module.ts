import { NgModule } from '@angular/core';
import { SelectorFilterTemplateComponent } from './selector-filter-template/selector-filter-template.component';
import { CommonModule } from '@angular/common';
import { SelectorOptionModule } from './selector-option/selector-option.module';
import { SelectorParentOptionModule } from './selector-parent-option/selector-parent-option.module';

@NgModule({
  declarations: [SelectorFilterTemplateComponent],
  exports: [SelectorFilterTemplateComponent],
  imports: [CommonModule, SelectorOptionModule, SelectorParentOptionModule],
})
export class AbstractSelectorFilterModule {}
