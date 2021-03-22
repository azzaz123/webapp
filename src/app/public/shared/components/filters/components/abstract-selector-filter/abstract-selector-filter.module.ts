import { NgModule } from '@angular/core';
import { SelectorFilterTemplateComponent } from './selector-filter-template/selector-filter-template.component';
import { CommonModule } from '@angular/common';
import { SelectorOptionModule } from './selector-option/selector-option.module';

@NgModule({
  declarations: [SelectorFilterTemplateComponent],
  exports: [SelectorFilterTemplateComponent],
  imports: [CommonModule, SelectorOptionModule],
})
export class AbstractSelectorFilterModule {}
