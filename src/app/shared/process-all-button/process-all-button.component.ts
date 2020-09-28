import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../core/tracking/tracking.service';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-process-all-button',
  templateUrl: './process-all-button.component.html',
  styleUrls: ['./process-all-button.component.scss']
})
export class ProcessAllButtonComponent {

  @Input() type: string;

  constructor(private trackingService: TrackingService,
              private modalService: NgbModal,
              private callsService: CallsService) {
  }

  public open(targetModal: string) {
    this.modalService.open(targetModal).result.then(() => {
      if (this.type === 'calls') {
        this.trackingService.track(TrackingService.PHONE_LEAD_LIST_ALL_PROCESSED);
        this.callsService.archiveAll().subscribe();
      }
    });
  }
}
