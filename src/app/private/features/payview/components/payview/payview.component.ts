import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private payviewStateManagementService: PayviewStateManagementService
  ) {}

  ngOnInit(): void {
    this.loadPayviewData();
    this.openModal();
  }

  private loadPayviewData(): void {
    const itemId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    this.payviewStateManagementService.itemHash = itemId;
  }

  private openModal(): void {
    this.modalService.open(PayviewOverviewComponent).result.then(
      () => {},
      () => {}
    );
  }
}
