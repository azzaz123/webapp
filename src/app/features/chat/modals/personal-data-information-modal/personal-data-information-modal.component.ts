import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-personal-data-information-modal',
  templateUrl: './personal-data-information-modal.component.html',
  styleUrls: ['./personal-data-information-modal.component.scss'],
})
export class PersonalDataInformationModal {
  constructor(public activeModal: NgbActiveModal) {}
}
