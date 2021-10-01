import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsModule } from '@private/features/reviews/reviews.module';
import { BumpTutorialComponent } from './components/bump-tutorial/bump-tutorial.component';
import { CatalogItemComponent } from './components/catalog-item/catalog-item.component';
import { CheckoutItemComponent } from './components/checkout-item/checkout-item.component';
import { SelectedItemsComponent } from './components/selected-items/selected-items.component';
import { SubscriptionsSlotItemComponent } from './components/subscriptions-slots/subscriptions-slot-item/subscriptions-slot-item.component';
import { SubscriptionsSlotsListComponent } from './components/subscriptions-slots/subscriptions-slots-list/subscriptions-slots-list.component';
import { BumpTutorialService } from './core/services/bump-tutorial.service';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { BuyProductModalComponent } from './modals/buy-product-modal/buy-product-modal.component';
import { ListingfeeConfirmationModalComponent } from './modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { TryProSlotComponent } from './components/subscriptions-slots/try-pro-slot/try-pro-slot.component';
import { ItemRequiredDataService } from '@private/core/services/item-required-data/item-required-data.service';
import { CatalogItemTrackingEventService } from './core/services/catalog-item-tracking-event.service';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { CatalogManagerApiService } from '@api/catalog-manager/catalog-manager-api.service';
import { CatalogManagerApiModule } from '@api/catalog-manager/catalog-manager-api.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CatalogRoutingModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbTooltipModule,
    ReviewsModule,
    ItemAvatarModule,
    CustomCurrencyModule,
    NavLinksModule,
    CatalogManagerApiModule,
  ],
  providers: [BumpTutorialService, ItemRequiredDataService, CatalogItemTrackingEventService],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    SelectedItemsComponent,
    SubscriptionsSlotItemComponent,
    SubscriptionsSlotsListComponent,
    BumpConfirmationModalComponent,
    CheckoutItemComponent,
    BumpTutorialComponent,
    BuyProductModalComponent,
    ListingfeeConfirmationModalComponent,
    TryProSlotComponent,
  ],
  entryComponents: [BumpConfirmationModalComponent, BuyProductModalComponent, ListingfeeConfirmationModalComponent],
})
export class CatalogModule {}
