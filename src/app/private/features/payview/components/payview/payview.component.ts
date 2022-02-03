import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayviewService } from '../../services/payview.service';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(private modalService: NgbModal, private route: ActivatedRoute, private payviewService: PayviewService) {}

  ngOnInit(): void {
    const itemId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    debugger;
    this.payviewService.itemHash = itemId;

    this.modalService.open(PayviewOverviewComponent).result.then(
      () => {},
      () => {}
    );
  }
}
