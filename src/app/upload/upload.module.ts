import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { uploadRoutedComponents, UploadRoutingModule } from './upload.routes';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { DropAreaComponent } from './drop-area/drop-area.component';
import { EditComponent } from './edit/edit.component';
import { UploadService } from './drop-area/upload.service';
import { RemoveConfirmModalComponent } from './drop-area/remove-confirm-modal/remove-confirm-modal.component';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';
import { UploadCarComponent } from './upload-car/upload-car.component';
import { CarKeysService } from './upload-car/car-keys.service';
import { CarSuggestionsService } from './upload-car/car-suggestions.service';
import { UploadProductComponent } from './upload-product/upload-product.component';
import { UploadRealestateComponent } from './upload-realestate/upload-realestate.component';
import { RealestateKeysService } from './upload-realestate/realestate-keys.service';
import { UrgentCheckboxComponent } from './urgent-checkbox/urgent-checkbox.component';
import { UploadComponent } from './upload.component';
import { ItemResolverService } from './item-resolver.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatIconModule } from '@angular/material';
import { NgbButtonsModule, NgbCarouselModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TrackingModule } from '../core/tracking/tracking.module';
import { DndModule } from 'ng2-dnd';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { GeneralSuggestionsService } from './upload-product/general-suggestions.service';
import { DropdownModule } from 'app/dropdown/dropdown.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UploadRoutingModule,
    NgxPermissionsModule.forChild(),
    MatIconModule,
    NgbPopoverModule,
    TrackingModule,
    DndModule,
    NgbCarouselModule,
    SelectModule,
    GeolocationModule,
    NgbButtonsModule,
    DropdownModule
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
    UrgentCheckboxComponent,
    UploadComponent
  ],
  providers: [
    UploadService,
    CarKeysService,
    CarSuggestionsService,
    RealestateKeysService,
    ItemResolverService,
    GeneralSuggestionsService
  ],
  entryComponents: [
    RemoveConfirmModalComponent,
    PreviewModalComponent
  ]
})
export class UploadModule { }
