import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-archive-inbox-conversation',
  templateUrl: './archive-inbox-conversation.component.html',
})
export class ArchiveInboxConversationComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
