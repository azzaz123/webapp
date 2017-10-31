import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-bump-confirmation-modal',
  templateUrl: './bump-confirmation-modal.component.html',
  styleUrls: ['./bump-confirmation-modal.component.scss']
})
export class BumpConfirmationModalComponent implements OnInit {

  public code: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
