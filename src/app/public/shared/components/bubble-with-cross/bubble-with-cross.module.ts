import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleWithCrossComponent } from './bubble-with-cross.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [BubbleWithCrossComponent],
  imports: [CommonModule, SvgIconModule],
})
export class BubbleWithCrossModule {}
