import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { DELIVERY_MODAL_CLASSNAME } from '../delivery/constants/delivery-constants';

@Component({
  selector: 'tsl-accept-screen',
  template: '',
})
export class AcceptScreenComponent implements OnInit, OnDestroy {
  constructor(private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    const modalRef = this.modalService.open(AcceptScreenModalComponent, { windowClass: DELIVERY_MODAL_CLASSNAME });
    modalRef.componentInstance.requestId = requestId;

    modalRef.result.then(
      () => {},
      () => {}
    );
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
