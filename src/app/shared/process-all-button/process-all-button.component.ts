import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-process-all-button',
  templateUrl: './process-all-button.component.html',
  styleUrls: ['./process-all-button.component.scss'],
})
export class ProcessAllButtonComponent {
  @Input() type: string;

  constructor(private modalService: NgbModal, private callsService: CallsService) {}

  public open(targetModal: string) {
    this.modalService.open(targetModal).result.then(() => {
      if (this.type === 'calls') {
        this.callsService.archiveAll().subscribe();
      }
    });
  }
}
