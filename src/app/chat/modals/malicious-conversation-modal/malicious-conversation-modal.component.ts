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

  public close(userClickedCTA: boolean) {
    this.activeModal.close(userClickedCTA);
  }

  // TODO: TNS-946 - https://wallapop.atlassian.net/browse/TNS-946
  private trackViewMaliciousModal(): void {
  }
}
