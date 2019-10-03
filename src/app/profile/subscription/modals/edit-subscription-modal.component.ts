import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-edit-subscription-modal',
  templateUrl: './edit-subscription-modal.component.html',
  styleUrls: ['./edit-subscription-modal.component.scss']
})

export class EditSubscriptionModalComponent implements OnInit {

  public isLast: boolean;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public selectedTier: Tier;
  public loading = false;
  public isPaymentError = false;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;
  public selectedPlanId: string;

  constructor(public activeModal: NgbActiveModal,
              private toastr: ToastrService,
              private i18n: I18nService,
              private eventService: EventService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.selectedTier = this.subscription.selected_tier;
    this.selectedPlanId = this.subscription.selected_tier.id;
  }

  public close() {
    this.activeModal.close();
  }

  public updateSubscription() {
    this.loading = true;
    //update subs endpoint
    this.close();
    this.toastr.success(this.i18n.getTranslations('editSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('editSubscriptionSuccessBody'));
    this.eventService.emit('subscriptionChange');
  }

  public cancelSubscription() {
    const modal = EditSubscriptionModalComponent
    let modalRef: NgbModalRef = this.modalService.open(modal, {windowClass: 'review'});
    modalRef.componentInstance.subscription = this.subscription;
    modalRef.result.then(() => {
      modalRef = null;
      this.toastr.success(this.i18n.getTranslations('cancelSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionSuccessBody'));
      this.eventService.emit('subscriptionChange');
    }, () => {});
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

}
