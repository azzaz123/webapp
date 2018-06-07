import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedItemsComponent } from './list/selected-items/selected-items.component';
import { MomentModule } from 'angular2-moment';
import { BumpConfirmationModalComponent } from './list/modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { CreditCardModalComponent } from './list/modals/credit-card-modal/credit-card-modal.component';
import { DropAreaComponent } from './upload/drop-area/drop-area.component';
import { UploadService } from './upload/drop-area/upload.service';
import { NgUploaderModule } from 'ngx-uploader';
import { DndModule } from 'ng2-dnd';
import { SelectModule } from 'ng-select';
import { CarSuggestionsService } from './upload/upload-car/car-suggestions.service';
import { CarKeysService } from './upload/upload-car/car-keys.service';
import { NgbButtonsModule, NgbCarouselModule, NgbDropdownModule, NgbPopoverModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ElasticModule } from 'ng-elastic';
import { UploadConfirmationModalComponent } from './list/modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { PreviewModalComponent } from './upload/preview-modal/preview-modal.component';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { UploadProductComponent } from './upload/upload-product/upload-product.component';
import { CategorySelectorComponent } from './upload/category-selector/category-selector.component';
import { ItemResolverService } from './item-resolver.service';
import { ExitConfirmationModalComponent } from './edit/exit-confirmation-modal/exit-confirmation-modal.component';
import { RemoveConfirmModalComponent } from './upload/drop-area/remove-confirm-modal/remove-confirm-modal.component';
import { ReactivateModalComponent } from './list/modals/reactivate-modal/reactivate-modal.component';
import { UrgentConfirmationModalComponent } from './list/modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { CheckoutItemComponent } from './checkout/checkout-item/checkout-item.component';
import { CartComponent } from './checkout/cart/cart.component';
import { CartService } from './checkout/cart/cart.service';
import { BumpTutorialComponent } from './checkout/bump-tutorial/bump-tutorial.component';
import { BumpTutorialService } from './checkout/bump-tutorial/bump-tutorial.service';
import { UrgentCheckboxComponent } from './upload/urgent-checkbox/urgent-checkbox.component';
import { SabadellComponent } from './sabadell/sabadell.component';
import { CheckoutExtrasProComponent } from './checkout/checkout-extras-pro/checkout-extras-pro.component';
import { CheckoutExtrasProItemComponent } from './checkout/checkout-extras-pro/checkout-extras-pro-item/checkout-extras-pro-item.component';
import { CheckoutProComponent } from './checkout/checkout-pro/checkout-pro.component';
import { CheckoutProItemComponent } from './checkout/checkout-pro/checkout-pro-item/checkout-pro-item.component';
import { CartProComponent } from './checkout/checkout-pro/cart-pro/cart-pro.component';
import { RangeDatepickerComponent } from './checkout/checkout-pro/range-datepicker/range-datepicker.component';
import { CartExtrasProComponent } from './checkout/checkout-extras-pro/cart-extras-pro/cart-extras-pro.component';
import { BillingInfoComponent } from './checkout/checkout-extras-pro/billing-info/billing-info.component';
import { CatalogCardComponent } from '../shared/catalog/catalog-card/catalog-card.component';
import { CatalogItemActionsComponent } from '../shared/catalog/catalog-item-actions/catalog-item-actions.component';
import { CatalogStatusNavbarComponent } from '../shared/catalog/catalog-status-navbar/catalog-status-navbar.component';
import { PlanDataComponent } from './catalog-pro/catalog-pro-list/plan-data/plan-data.component';
import { ProBumpConfirmationModalComponent } from './catalog-pro/catalog-pro-list/modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { ProUrgentConfirmationModalComponent } from './catalog-pro/catalog-pro-list/modals/pro-urgent-confirmation-modal/pro-urgent-confirmation-modal.component';
import { DeleteInfoConfirmationModalComponent } from '../profile/profile-pro/profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CoreModule,
    CatalogRoutingModule,
    MatIconModule,
    InfiniteScrollModule,
    MomentModule,
    NgUploaderModule,
    DndModule,
    ReactiveFormsModule,
    SelectModule,
    NgbButtonsModule,
    ElasticModule,
    NgbDropdownModule,
    NgbPopoverModule,
    NgbCarouselModule,
    GeolocationModule,
    NgbDatepickerModule
  ],
  providers: [
    CarSuggestionsService,
    CarKeysService,
    UploadService,
    ItemResolverService,
    CartService,
    BumpTutorialService
  ],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    SelectedItemsComponent,
    BumpConfirmationModalComponent,
    CreditCardModalComponent,
    DropAreaComponent,
    UploadConfirmationModalComponent,
    PreviewModalComponent,
    UploadProductComponent,
    CategorySelectorComponent,
    ExitConfirmationModalComponent,
    CategorySelectorComponent,
    RemoveConfirmModalComponent,
    ReactivateModalComponent,
    CheckoutItemComponent,
    CartComponent,
    BumpTutorialComponent,
    UrgentConfirmationModalComponent,
    UrgentCheckboxComponent,
    SabadellComponent,
    CheckoutExtrasProComponent,
    CheckoutExtrasProItemComponent,
    CheckoutProComponent,
    CheckoutProItemComponent,
    CartProComponent,
    RangeDatepickerComponent,
    CartExtrasProComponent,
    BillingInfoComponent,
    CatalogCardComponent,
    CatalogItemActionsComponent,
    CatalogStatusNavbarComponent,
    PlanDataComponent,
    ProBumpConfirmationModalComponent,
    ProUrgentConfirmationModalComponent
  ],
  entryComponents: [
    BumpConfirmationModalComponent,
    CreditCardModalComponent,
    UploadConfirmationModalComponent,
    PreviewModalComponent,
    ExitConfirmationModalComponent,
    PreviewModalComponent,
    RemoveConfirmModalComponent,
    ReactivateModalComponent,
    UrgentConfirmationModalComponent,
    ProBumpConfirmationModalComponent,
    ProUrgentConfirmationModalComponent,
    DeleteInfoConfirmationModalComponent
  ]
})
export class CatalogModule {
}
