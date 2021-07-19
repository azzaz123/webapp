import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KycModalComponent } from './modals/kyc-modal/kyc-modal.component';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
})
export class KYCComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    // TODO: dismiss redirect		Date: 2021/07/19
    this.modalService.open(KycModalComponent);
  }
}
