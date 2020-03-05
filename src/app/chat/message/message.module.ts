import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';
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
    MomentModule,
    MatIconModule,
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
    ThirdVoiceMessageComponent,
    ThirdVoiceReviewComponent,
    ThirdVoiceDropPriceComponent
  ]
})
export class MessageModule {
}
