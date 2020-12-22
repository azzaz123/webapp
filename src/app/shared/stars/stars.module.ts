import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { StarsComponent } from './stars.component';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [StarsComponent],
  exports: [StarsComponent],
})
export class StarsModule {}
