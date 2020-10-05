import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-malicious-conversation-modal',
  templateUrl: './malicious-conversation-modal.component.html',
  styleUrls: ['./malicious-conversation-modal.component.scss']
})
export class MaliciousConversationModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.trackViewMaliciousModal();
  }

  // TODO: TNS-925 - https://wallapop.atlassian.net/browse/TNS-925
  private trackViewMaliciousModal(): void {
  }
}
