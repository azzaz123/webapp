import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ThirdVoiceShippingKeywordsComponent } from './components';
import { TextMessageComponent } from './components/text-message';
import { ThirdVoiceDeliveryComponent } from './components/third-voice-delivery/third-voice-delivery.component';
import { ThirdVoiceDropPriceComponent } from './components/third-voice-drop-price';
import { ThirdVoiceMessageComponent } from './components/third-voice-message';
import { ThirdVoiceReviewComponent } from './components/third-voice-review';
import { ThirdVoiceReviewButtonComponent } from './components/third-voice-review-button';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    TextMessageComponent,
    ThirdVoiceDeliveryComponent,
    ThirdVoiceShippingKeywordsComponent,
    ThirdVoiceMessageComponent,
    ThirdVoiceReviewComponent,
    ThirdVoiceReviewButtonComponent,
    ThirdVoiceDropPriceComponent,
  ],
  exports: [
    TextMessageComponent,
    ThirdVoiceDeliveryComponent,
    ThirdVoiceShippingKeywordsComponent,
    ThirdVoiceReviewComponent,
    ThirdVoiceDropPriceComponent,
  ],
})
export class MessageModule {}
