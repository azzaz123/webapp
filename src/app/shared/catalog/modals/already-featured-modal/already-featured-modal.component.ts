import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';

@Component({
  selector: 'tsl-already-featured-modal',
  templateUrl: './already-featured-modal.component.html',
  styleUrls: ['./already-featured-modal.component.scss'],
})
export class AlreadyFeaturedModalComponent {
  constructor(public activeModal: NgbActiveModal, public itemService: ItemService) {}
}
