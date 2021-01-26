import { NgModule } from '@angular/core';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [BubbleComponent],
  exports: [BubbleComponent],
  imports: [CommonModule, SvgIconModule],
})
export class BubbleModule {}
