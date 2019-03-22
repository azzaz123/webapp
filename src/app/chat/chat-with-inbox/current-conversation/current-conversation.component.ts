import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CurrentConversation } from './current-conversation';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnChanges {

  @Input() currentConversation: CurrentConversation;

  constructor(
    // private eventService: EventService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.currentConversation);
  }

}
