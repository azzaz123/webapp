import { NgModule } from '@angular/core';
import { SelectorOptionComponent } from './selector-option.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SvgIconModule, CommonModule],
  declarations: [SelectorOptionComponent],
  exports: [SelectorOptionComponent],
})
export class SelectorOptionModule {}
