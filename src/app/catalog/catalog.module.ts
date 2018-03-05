import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material';
import { SoldModalComponent } from './list/modals/sold-modal/sold-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from 'shield';
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
import { NgbButtonsModule, NgbCarouselModule, NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
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
import { CheckoutItemComponent } from './checkout/checkout-item/checkout-item.component';
import { CartComponent } from './checkout/cart/cart.component';
import { CartService } from './checkout/cart/cart.service';
import { BumpTutorialComponent } from './checkout/bump-tutorial/bump-tutorial.component';
import { BumpTutorialService } from './checkout/bump-tutorial/bump-tutorial.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CoreModule,
    CatalogRoutingModule,
    MatIconModule,
    InfiniteScrollModule,
    UtilsModule,
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
    GeolocationModule
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
    SoldModalComponent,
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
    BumpTutorialComponent
  ],
  entryComponents: [
    BumpConfirmationModalComponent,
    SoldModalComponent,
    CreditCardModalComponent,
    UploadConfirmationModalComponent,
    PreviewModalComponent,
    ExitConfirmationModalComponent,
    PreviewModalComponent,
    RemoveConfirmModalComponent,
    ReactivateModalComponent
  ]
})
export class CatalogModule {
}
