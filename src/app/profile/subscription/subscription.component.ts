import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { Subscriptions } from '../../core/subscriptions/subscriptions.interface';


@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  public action: string;
  public subscriptions: Subscriptions[];

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  public openSubscriptionModal(): void {
    let modalRef: NgbModalRef = this.modalService.open(AddNewSubscriptionModalComponent, {windowClass: 'review'});
    modalRef.result.then(() => {
      this.action = 'clear';
      modalRef = null;
    }, () => {});
  }
  
}
