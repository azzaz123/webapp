import { NgModule } from '@angular/core';
import { SelectorFilterTemplateComponent } from './selector-filter-template/selector-filter-template.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SelectorFilterTemplateComponent],
  exports: [SelectorFilterTemplateComponent],
  imports: [CommonModule],
})
export class AbstractSelectorFilterModule {}
