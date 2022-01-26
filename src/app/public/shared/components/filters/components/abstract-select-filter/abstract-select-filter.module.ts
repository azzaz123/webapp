import { NgModule } from '@angular/core';
import { DrawerPlaceholderTemplateComponent } from './select-filter-template/drawer-placeholder-template.component';
import { CommonModule } from '@angular/common';
import { SelectOptionModule } from '@shared/form/components/select/select-option/select-option.module';
import { SelectParentOptionModule } from './select-parent-option/select-parent-option.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';
import { ScrollModule } from '@shared/scroll/scroll.module';

@NgModule({
  declarations: [DrawerPlaceholderTemplateComponent],
  exports: [DrawerPlaceholderTemplateComponent],
  imports: [ButtonModule, CommonModule, SelectOptionModule, SelectParentOptionModule, SvgIconModule, ScrollModule],
})
export class AbstractSelectFilterModule {}
