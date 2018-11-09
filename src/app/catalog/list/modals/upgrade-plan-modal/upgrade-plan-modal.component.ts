import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-upgrade-plan-modal',
  templateUrl: './upgrade-plan-modal.component.html',
  styleUrls: ['./upgrade-plan-modal.component.scss']
})
export class UpgradePlanModalComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

}
