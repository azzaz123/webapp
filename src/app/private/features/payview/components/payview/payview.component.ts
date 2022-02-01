import { Component, OnInit } from '@angular/core';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalService.open(PayviewOverviewComponent).result.then(
      () => {},
      () => {}
    );
  }
}
