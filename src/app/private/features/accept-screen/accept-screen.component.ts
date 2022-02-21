import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { DELIVERY_MODAL } from '../delivery/constants/delivery-constants';

@Component({
  selector: 'tsl-accept-screen',
  template: '',
})
export class AcceptScreenComponent implements OnInit {
  constructor(private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    const modalRef = this.modalService.open(AcceptScreenModalComponent, { windowClass: DELIVERY_MODAL });
    modalRef.componentInstance.requestId = requestId;

    modalRef.result.then(
      () => {},
      () => {}
    );
  }
}
