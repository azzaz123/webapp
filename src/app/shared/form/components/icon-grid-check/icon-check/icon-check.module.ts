import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconCheckComponent } from './icon-check.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [IconCheckComponent],
  exports: [IconCheckComponent],
  imports: [CommonModule, SvgIconModule],
})
export class IconCheckModule {}
