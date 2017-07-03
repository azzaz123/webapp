import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-archive-conversation',
  templateUrl: './archive-conversation.component.html'
})
export class ArchiveConversationComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

}
