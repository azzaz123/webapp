import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-visibility-products-modal',
  templateUrl: './visibility-products-modal.component.html',
  styleUrls: ['./visibility-products-modal.component.scss'],
})
export class VisibilityProductsModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
