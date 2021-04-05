import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconCheckBoxComponent } from './icon-check-box.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [IconCheckBoxComponent],
  exports: [IconCheckBoxComponent],
  imports: [CommonModule, SvgIconModule],
})
export class IconCheckBoxModule {}
