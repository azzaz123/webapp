import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MultiSelectOptionModule } from '../multi-select-form/multi-select-option/multi-select-option/multi-select-option.module';
import { MultiSelectFormV2Component } from './multi-select-form-v2.component';

@NgModule({
  imports: [CommonModule, FormsModule, MultiSelectOptionModule, SvgIconModule],
  declarations: [MultiSelectFormV2Component],
  exports: [MultiSelectFormV2Component],
})
export class MultiSelectFormV2Module {}
