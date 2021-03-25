import { NgModule } from '@angular/core';
import { SelectorParentOptionComponent } from './selector-parent-option.component';
import { SelectorOptionModule } from '../selector-option/selector-option.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SelectorParentOptionComponent],
  exports: [SelectorParentOptionComponent],
  imports: [SelectorOptionModule, SvgIconModule, HttpClientModule, CommonModule],
})
export class SelectorParentOptionModule {}
