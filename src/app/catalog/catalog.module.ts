import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedItemsComponent } from './list/selected-items/selected-items.component';
import { BumpConfirmationModalComponent } from './list/modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadConfirmationModalComponent } from './list/modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { ReactivateModalComponent } from './list/modals/reactivate-modal/reactivate-modal.component';
import { UrgentConfirmationModalComponent } from './list/modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { CheckoutItemComponent } from './checkout/checkout-item/checkout-item.component';
import { BumpTutorialComponent } from './checkout/bump-tutorial/bump-tutorial.component';
import { BumpTutorialService } from './checkout/bump-tutorial/bump-tutorial.service';
import { TrackingModule } from '../core/tracking/tracking.module';
import { BuyProductModalComponent } from './list/modals/buy-product-modal/buy-product-modal.component';
import { ReactivateConfirmationModalComponent } from './list/modals/reactivate-confirmation-modal/reactivate-confirmation-modal.component';
import { ListingfeeConfirmationModalComponent } from './list/modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { SelectModule } from 'ng-select';
import { SubscriptionsSlotsListComponent } from './list/subscriptions-slots/subscriptions-slots-list/subscriptions-slots-list.component';
import { SubscriptionsSlotItemComponent } from './list/subscriptions-slots/subscriptions-slot-item/subscriptions-slot-item.component';
import { ReviewsModule } from '../reviews/reviews.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CatalogRoutingModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    TrackingModule,
    NgbButtonsModule,
    NgbTooltipModule,
    SelectModule,
    ReviewsModule
  ],
  providers: [
    BumpTutorialService,
  ],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    SelectedItemsComponent,
    SubscriptionsSlotItemComponent,
    SubscriptionsSlotsListComponent,
    BumpConfirmationModalComponent,
    UploadConfirmationModalComponent,
    ReactivateModalComponent,
    CheckoutItemComponent,
    BumpTutorialComponent,
    UrgentConfirmationModalComponent,
    BuyProductModalComponent,
    ReactivateConfirmationModalComponent,
    ListingfeeConfirmationModalComponent
  ],
  entryComponents: [
    BumpConfirmationModalComponent,
    UploadConfirmationModalComponent,
    ReactivateModalComponent,
    UrgentConfirmationModalComponent,
    BuyProductModalComponent,
    ReactivateConfirmationModalComponent,
    ListingfeeConfirmationModalComponent
  ]
})
export class CatalogModule {
}
