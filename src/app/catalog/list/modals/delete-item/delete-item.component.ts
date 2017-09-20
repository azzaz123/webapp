import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-delete-item',
  templateUrl: './delete-item.component.html'
})
export class DeleteItemComponent {

  constructor(public activeModal: NgbActiveModal) { }

}
