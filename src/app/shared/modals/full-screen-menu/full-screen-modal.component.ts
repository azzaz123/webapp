import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NavLink } from 'app/shared/nav-links/nav-link.interface';

@Component({
  selector: 'tsl-full-screen-modal',
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss'],
})
export class FullScreenModalComponent {
  public items: NavLink[] | any[];

  constructor(public activeModal: NgbActiveModal) {}

  public selectItem(selectedLink: NavLink): void {
    this.activeModal.close(selectedLink);
  }
}
