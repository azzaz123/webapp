import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-malicious-conversation-modal',
  templateUrl: './malicious-conversation-modal.component.html',
  styleUrls: ['./malicious-conversation-modal.component.scss']
})
export class MaliciousConversationModalComponent implements OnInit, OnDestroy {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.trackViewMaliciousModal();
  }

  ngOnDestroy(): void {
    this.trackCloseMaliciousModal();
  }

  // TODO: TNS-946 - https://wallapop.atlassian.net/browse/TNS-946
  private trackViewMaliciousModal(): void {
  }

  private trackCloseMaliciousModal(): void {
  }

}
