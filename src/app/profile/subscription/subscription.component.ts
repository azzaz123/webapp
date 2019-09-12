import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from './modals/add-new-subscription-modal.component';
import { SubscriptionsResponse, Tier } from '../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { CategoryResponse } from '../../core/category/category-response.interface';
import { CategoryService } from '../../core/category/category.service';
import { flatMap } from 'rxjs/operators';


@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  public action: string;
  public subscriptions: SubscriptionsResponse[];

  constructor(private modalService: NgbModal,
              private subscriptionsService: SubscriptionsService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.getSubscriptions();
  }

  public openSubscriptionModal(subscription: SubscriptionsResponse): void {
    let modalRef: NgbModalRef = this.modalService.open(AddNewSubscriptionModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then(() => {
      this.action = 'clear';
      modalRef = null;
    }, () => {});
  }

  private getSubscriptions(): void {
    this.categoryService.getCategories()
    .pipe(
      flatMap(categories => this.subscriptionsService.getSubscriptions(categories)),
    )
    .subscribe(response => this.subscriptions = response); 
  }

  
}
