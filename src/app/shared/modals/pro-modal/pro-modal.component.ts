import { Component } from '@angular/core';
import { REDIRECT_SECRET } from '@core/user/logged.guard';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MODAL_ACTION, ProModalConfig, REDIRECT_TYPE } from './pro-modal.interface';

@Component({
  selector: 'tsl-pro-modal',
  templateUrl: './pro-modal.component.html',
  styleUrls: ['./pro-modal.component.scss'],
})
export class ProModalComponent {
  public modalConfig: ProModalConfig;
  public readonly MODAL_ACTION = MODAL_ACTION;
  public readonly REDIRECT_TYPE = REDIRECT_TYPE;

  constructor(private activeModal: NgbActiveModal) {}

  public onClose(action?: MODAL_ACTION): void {
    this.activeModal.close(action);
  }
}
