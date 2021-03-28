import { NgModule } from '@angular/core';
import { SelectorFilterTemplateComponent } from './selector-filter-template/selector-filter-template.component';
import { CommonModule } from '@angular/common';
import { SelectorOptionModule } from './selector-option/selector-option.module';
import { SelectorParentOptionModule } from './selector-parent-option/selector-parent-option.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [SelectorFilterTemplateComponent],
  exports: [SelectorFilterTemplateComponent],
  imports: [CommonModule, SelectorOptionModule, SelectorParentOptionModule, SvgIconModule],
})
export class AbstractSelectorFilterModule {}
