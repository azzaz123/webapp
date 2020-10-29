import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdVoiceMessageComponent } from './third-voice-message';
import { TextMessageComponent } from './text-message';
import { ThirdVoiceReviewButtonComponent } from './third-voice-review-button';
import { SharedModule } from '../../shared/shared.module';
import { ThirdVoiceDropPriceComponent } from './third-voice-drop-price';
import { ThirdVoiceReviewComponent } from './third-voice-review';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
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
    ThirdVoiceDropPriceComponent
  ]
})
export class MessageModule {
}
