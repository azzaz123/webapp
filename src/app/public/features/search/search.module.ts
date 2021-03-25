import { NgModule } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { PublicLayoutModule } from '@public/layout/public-layout.module';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { AdSlotShoppingModule } from '@shared/ads/ad-slot-shopping/ad-slot-shopping.module';
import { AdSlotModule } from '@shared/ads/ad-slot/ad-slot.module';
import { SharedModule } from '@shared/shared.module';
import { FiltersWrapperModule } from './components/filters-wrapper/filters-wrapper.module';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { SearchStoreService } from './core/services/search-store.service';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';

@NgModule({
  imports: [
    SharedModule,
    SearchRoutingModule,
    PublicLayoutModule,
    ItemCardListModule,
    CheckSessionModule,
    FiltersWrapperModule,
    AdSlotModule,
    AdSlotShoppingModule,
  ],
  providers: [ViewportService, SearchStoreService],
  declarations: [SearchComponent, SearchLayoutComponent],
})
export class SearchModule {}
