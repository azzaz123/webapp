import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelBubbleComponent } from './cancel-bubble.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [CancelBubbleComponent],
  imports: [CommonModule, SvgIconModule],
})
export class BubbleWithCrossModule {}
