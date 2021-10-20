import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { modalConfig, PRO_MODAL_TYPE } from './pro-modal.constants';
import { MODAL_ACTION, ProModalConfig } from './pro-modal.interface';

@Component({
  selector: 'tsl-pro-modal',
  templateUrl: './pro-modal.component.html',
  styleUrls: ['./pro-modal.component.scss'],
})
export class ProModalComponent implements OnInit {
  modalConfig: ProModalConfig;
  public readonly MODAL_ACTION = MODAL_ACTION;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.modalConfig = modalConfig[PRO_MODAL_TYPE.simulation];
  }

  public onClose(action?: MODAL_ACTION): void {
    this.activeModal.close(action);
  }
}
