import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-confirmation-modal-v2',
  templateUrl: './confirmation-modal-v2.component.html',
  styleUrls: ['./confirmation-modal-v2.component.scss'],
})
export class ConfirmationModalV2Component {
  public title: string;
  public text: string;
  public image: string;
  public primaryBtnText: string;
  public secondaryBtnText: string;

  constructor(public activeModal: NgbActiveModal) {}
}
