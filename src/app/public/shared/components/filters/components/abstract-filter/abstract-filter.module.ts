import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  imports: [CommonModule, BubbleModule, NgbDropdownModule, ButtonModule],
  declarations: [FilterTemplateComponent],
  exports: [FilterTemplateComponent],
})
export class AbstractFilterModule {}
