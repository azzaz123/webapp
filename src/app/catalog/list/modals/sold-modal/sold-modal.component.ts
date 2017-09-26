import { Component, OnInit } from '@angular/core';
import { Item } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-sold-modal',
  templateUrl: './sold-modal.component.html',
  styleUrls: ['./sold-modal.component.scss']
})
export class SoldModalComponent implements OnInit {

  public item: Item;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
