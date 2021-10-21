import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MODAL_ACTION, ProModalConfig } from './pro-modal.interface';

@Component({
  selector: 'tsl-pro-modal',
  templateUrl: './pro-modal.component.html',
  styleUrls: ['./pro-modal.component.scss'],
})
export class ProModalComponent {
  modalConfig: ProModalConfig;
  public readonly MODAL_ACTION = MODAL_ACTION;

  constructor(private activeModal: NgbActiveModal) {}

  public onClose(action?: MODAL_ACTION): void {
    this.activeModal.close(action);
  }
}
