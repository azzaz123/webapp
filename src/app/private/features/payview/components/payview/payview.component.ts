import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadPayviewData();
    this.openModal();
  }

  private loadPayviewData(): void {
    const itemId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
  }

  private openModal(): void {
    this.modalService.open(PayviewModalComponent).result.then(
      () => {},
      () => {}
    );
  }
}
