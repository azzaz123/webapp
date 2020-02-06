import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-unarchive-inbox-conversation',
  templateUrl: './unarchive-inbox-conversation.component.html'
})
export class UnarchiveInboxConversationComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

}
