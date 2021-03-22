import { NgModule } from '@angular/core';
import { SelectorOptionComponent } from './selector-option.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SvgIconModule, HttpClientModule, CommonModule],
  declarations: [SelectorOptionComponent],
  exports: [SelectorOptionComponent],
})
export class SelectorOptionModule {}
