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
  ],
  providers: [BumpTutorialService],
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
