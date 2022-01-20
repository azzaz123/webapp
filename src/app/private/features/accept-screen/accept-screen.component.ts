import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcceptScreenModalComponent } from './components/accept-screen-modal/accept-screen-modal.component';

@Component({
  selector: 'tsl-accept-screen',
  template: '',
})
export class AcceptScreenComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalService.open(AcceptScreenModalComponent).result.then(
      () => {},
      () => {}
    );
  }
}
