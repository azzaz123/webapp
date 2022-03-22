import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsModule } from '@private/features/reviews/reviews.module';
import { CatalogItemComponent } from './components/catalog-item/catalog-item.component';
import { SelectedItemsComponent } from './components/selected-items/selected-items.component';
import { SubscriptionsSlotItemComponent } from './components/subscriptions-slots/subscriptions-slot-item/subscriptions-slot-item.component';
import { SubscriptionsSlotsListComponent } from './components/subscriptions-slots/subscriptions-slots-list/subscriptions-slots-list.component';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { TryProSlotComponent } from './components/subscriptions-slots/try-pro-slot/try-pro-slot.component';
import { ItemRequiredDataService } from '@private/core/services/item-required-data/item-required-data.service';
import { CatalogItemTrackingEventService } from './core/services/catalog-item-tracking-event.service';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { CatalogManagerApiModule } from '@api/catalog-manager/catalog-manager-api.module';
import { ListingLimitService } from '@core/subscriptions/listing-limit/listing-limit.service';
import { MeApiModule } from '@api/me/me-api.module';
import { BumpTutorialModule } from '@shared/bump-tutorial/bump-tutorial.module';
import { VisibilityApiModule } from '@api/visibility/visibility-api.module';

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
    MeApiModule,
    BumpTutorialModule,
    VisibilityApiModule,
  ],
  providers: [ItemRequiredDataService, CatalogItemTrackingEventService, ListingLimitService],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    SelectedItemsComponent,
    SubscriptionsSlotItemComponent,
    SubscriptionsSlotsListComponent,
    TryProSlotComponent,
  ],
})
export class CatalogModule {}
