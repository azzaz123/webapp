import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-already-featured-modal',
  templateUrl: './already-featured-modal.component.html',
  styleUrls: ['./already-featured-modal.component.scss']
})
export class AlreadyFeaturedModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
