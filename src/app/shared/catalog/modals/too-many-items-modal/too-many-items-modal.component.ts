import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss']
})
export class TooManyItemsModalComponent implements OnInit {

  public isInApp = false;
  public isPro = true;
  public isCarDealer = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
