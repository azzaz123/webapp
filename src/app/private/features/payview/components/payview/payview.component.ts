import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.openModal(this.getPayviewData());
  }

  private getPayviewData(): string {
    return this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
  }

  private openModal(itemHash: string): void {
    const modalRef = this.modalService.open(PayviewModalComponent);
    modalRef.componentInstance.itemHash = itemHash;

    modalRef.result.then(
      () => {},
      () => {}
    );
  }
}
