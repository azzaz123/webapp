import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TextMessageComponent } from './components/text-message';
import { ThirdVoiceDropPriceComponent } from './components/third-voice-drop-price';
import { ThirdVoiceMessageComponent } from './components/third-voice-message';
import { ThirdVoiceReviewComponent } from './components/third-voice-review';
import { ThirdVoiceReviewButtonComponent } from './components/third-voice-review-button';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    TextMessageComponent,
    ThirdVoiceMessageComponent,
    ThirdVoiceReviewComponent,
    ThirdVoiceReviewButtonComponent,
    ThirdVoiceDropPriceComponent,
  ],
  exports: [
    TextMessageComponent,
    ThirdVoiceReviewComponent,
    ThirdVoiceDropPriceComponent,
  ],
})
export class MessageModule {}
