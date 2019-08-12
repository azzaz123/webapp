import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {

    public action: string;

    constructor(private modalService: NgbModal) {
    }

    openSubscriptionModal() {
        let modalRef: NgbModalRef = this.modalService.open(AddNewSubscriptionModalComponent, {windowClass: 'review'});
        modalRef.result.then((response) => {
            console.log('new payment modal response ', response);
            this.action = 'clear';
            modalRef = null;
        }, () => {});
    }
  
}
