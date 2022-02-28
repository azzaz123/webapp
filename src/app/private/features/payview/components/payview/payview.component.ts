import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payview',
  template: '',
})
export class PayviewComponent implements OnInit {
  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private route: Router) {}

  ngOnInit(): void {
    this.openModal(this.itemHash);
  }

  private get itemHash(): string {
    return this.activatedRoute.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
  }

  private navigateToChat(): void {
    this.route.navigate([PRIVATE_PATHS.CHAT]);
  }

  private openModal(itemHash: string): void {
    const modalRef = this.modalService.open(PayviewModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.itemHash = itemHash;

    modalRef.result.then(
      () => {
        this.navigateToChat();
      },
      () => {
        this.navigateToChat();
      }
    );
  }
}
