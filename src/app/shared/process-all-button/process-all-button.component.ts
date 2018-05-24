import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Observable } from 'rxjs/Observable';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-process-all-button',
  templateUrl: './process-all-button.component.html',
  styleUrls: ['./process-all-button.component.scss']
})
export class ProcessAllButtonComponent {

  @Input() type: string;

  constructor(private conversationService: ConversationService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private callsService: CallsService) {
  }

  public open(targetModal: string) {
    let observable: Observable<any>;
    this.modalService.open(targetModal).result.then(() => {
      this.conversationService.archiveAll().subscribe(() => {
        if (this.type === 'calls') {
          this.trackingService.track(TrackingService.PHONE_LEAD_LIST_ALL_PROCESSED);
          observable = this.callsService.archiveAll();
        } else {
          this.trackingService.track(TrackingService.CONVERSATION_LIST_ALL_PROCESSED);
          observable = this.conversationService.archiveAll();
        }
        observable.subscribe();
      });
    });
  }
}
