import { Component, OnInit } from '@angular/core';

import { MessageComponent } from '../message.component';
import { MessageType } from '../inbox-message';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../message.component.scss']
})
export class ThirdVoiceMessageComponent extends MessageComponent implements OnInit {

  public static allowMessageTypes = [MessageType.PRICE_DROP, MessageType.REVIEW, MessageType.SECURITY_WARNING];

  ngOnInit() {
    super.ngOnInit();
  }
}
