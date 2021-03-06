import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbCarouselModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SharedModule } from '@shared/shared.module';
import { DndModule } from 'ng2-dnd';
import { CategorySelectorComponent } from './components/category-selector/category-selector.component';
import { DropAreaComponent } from './components/drop-area/drop-area.component';
import { EditComponent } from './components/edit/edit.component';
import { EditTrackingEventService } from './core/services/edit-tracking-event/edit-tracking-event.service';
import { ItemResolverService } from './core/resolvers/item-resolver.service';
import { CarKeysService } from './core/services/car-keys/car-keys.service';
import { CarSuggestionsService } from './core/services/car-suggestions/car-suggestions.service';
import { GeneralSuggestionsService } from './core/services/general-suggestions/general-suggestions.service';
import { ItemReactivationService } from './core/services/item-reactivation/item-reactivation.service';
import { RealestateKeysService } from './core/services/realstate-keys/realestate-keys.service';
import { UploadService } from './core/services/upload/upload.service';
import { PreviewModalComponent } from './modals/preview-modal/preview-modal.component';
import { RemoveConfirmModalComponent } from './modals/remove-confirm-modal/remove-confirm-modal.component';
import { UploadCarComponent } from './pages/upload-car/upload-car.component';
import { UploadProductComponent } from './pages/upload-product/upload-product.component';
import { UploadRealestateComponent } from './pages/upload-realestate/upload-realestate.component';
import { UploadComponent } from './pages/upload.component';
import { uploadRoutedComponents, UploadRoutingModule } from './upload-routing.module';
import { CheckboxFormModule } from '@shared/form/components/checkbox/checkbox-form.module';
import { ShippingToggleService } from './pages/upload-product/services/shipping-toggle/shipping-toggle.service';
import { DeliveryRulesApiModule } from '@api/bff/delivery/rules/delivery-rules-api.module';
import { UploadTrackingEventService } from './pages/upload-product/upload-tracking-event/upload-tracking-event.service';
import { CategoriesApiModule } from '@api/categories/categories-api.module';
import { ProFeaturesModule } from './components/pro-features/pro-features.module';
import { HashtagFieldModule } from './components/hashtag-field/hashtag-field.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UploadRoutingModule,
    NgbPopoverModule,
    DndModule.forRoot(),
    NgbCarouselModule,
    GeolocationModule,
    NgbButtonsModule,
    DropdownModule,
    CustomCurrencyModule,
    CheckboxFormModule,
    DeliveryRulesApiModule, // todo extract to upload product, needs to prepare modules for each upload form (maybe need a shared one for them)
    CategoriesApiModule,
    ProFeaturesModule,
    HashtagFieldModule,
  ],
  declarations: [
    uploadRoutedComponents,
    CategorySelectorComponent,
    DropAreaComponent,
    EditComponent,
    RemoveConfirmModalComponent,
    PreviewModalComponent,
    UploadCarComponent,
    UploadProductComponent,
    UploadRealestateComponent,
    UploadComponent,
  ],
  providers: [
    UploadService,
    CarKeysService,
    CarSuggestionsService,
    RealestateKeysService,
    ItemResolverService,
    GeneralSuggestionsService,
    ItemReactivationService,
    EditTrackingEventService,
    UploadTrackingEventService,
    ShippingToggleService, // todo extract to upload product, needs to prepare modules for each upload form (maybe need a shared one for them)
  ],
  entryComponents: [RemoveConfirmModalComponent, PreviewModalComponent],
})
export class UploadModule {}
