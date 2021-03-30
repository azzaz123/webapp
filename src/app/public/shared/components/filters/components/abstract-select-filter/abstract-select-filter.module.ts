import { NgModule } from '@angular/core';
import { SelectFilterTemplateComponent } from './select-filter-template/select-filter-template.component';
import { CommonModule } from '@angular/common';
import { SelectOptionModule } from '@shared/form/components/select/select-option/select-option.module';
import { SelectParentOptionModule } from './select-parent-option/select-parent-option.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [SelectFilterTemplateComponent],
  exports: [SelectFilterTemplateComponent],
  imports: [CommonModule, SelectOptionModule, SelectParentOptionModule, SvgIconModule],
})
export class AbstractSelectFilterModule {}
