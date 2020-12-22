import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrackingModule } from '@core/tracking/tracking.module';
import {
  NgbButtonsModule,
  NgbCarouselModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { SharedModule } from '@shared/shared.module';
import { DndModule } from 'ng2-dnd';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CategorySelectorComponent } from './components/category-selector/category-selector.component';
import { DropAreaComponent } from './components/drop-area/drop-area.component';
import { EditComponent } from './components/edit/edit.component';
import { ItemResolverService } from './core/resolvers/item-resolver.service';
import { CarKeysService } from './core/services/car-keys/car-keys.service';
import { CarSuggestionsService } from './core/services/car-suggestions/car-suggestions.service';
import { GeneralSuggestionsService } from './core/services/general-suggestions/general-suggestions.service';
import { RealestateKeysService } from './core/services/realstate-keys/realestate-keys.service';
import { UploadService } from './core/services/upload/upload.service';
import { PreviewModalComponent } from './modals/preview-modal/preview-modal.component';
import { RemoveConfirmModalComponent } from './modals/remove-confirm-modal/remove-confirm-modal.component';
import { UploadCarComponent } from './pages/upload-car/upload-car.component';
import { UploadProductComponent } from './pages/upload-product/upload-product.component';
import { UploadRealestateComponent } from './pages/upload-realestate/upload-realestate.component';
import { UploadComponent } from './pages/upload.component';
import { uploadRoutedComponents, UploadRoutingModule } from './upload.routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UploadRoutingModule,
    NgxPermissionsModule.forChild(),
    NgbPopoverModule,
    TrackingModule,
    DndModule.forRoot(),
    NgbCarouselModule,
    GeolocationModule,
    NgbButtonsModule,
    DropdownModule,
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
  ],
  entryComponents: [RemoveConfirmModalComponent, PreviewModalComponent],
})
export class UploadModule {}
