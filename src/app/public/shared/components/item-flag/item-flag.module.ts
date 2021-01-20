import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ItemFlagComponent } from './item-flag.component';

@NgModule({
  declarations: [ItemFlagComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [ItemFlagComponent],
})
export class ItemFlagModule {}
