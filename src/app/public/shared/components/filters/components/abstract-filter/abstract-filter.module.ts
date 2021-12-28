import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { ButtonModule } from '@shared/button/button.module';
import { FilterDropdownDirective } from './filter-template/directives/filter-dropdown.directive';
import { IsBubblePipe } from './pipes/is-bubble.pipe';

@NgModule({
  imports: [CommonModule, BubbleModule, ButtonModule],
  declarations: [FilterTemplateComponent, FilterDropdownDirective, IsBubblePipe],
  exports: [FilterTemplateComponent, IsBubblePipe],
})
export class AbstractFilterModule {}
