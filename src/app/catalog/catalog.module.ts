import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedItemsComponent } from './list/selected-items/selected-items.component';
import { MomentModule } from 'angular2-moment';
import { BumpConfirmationModalComponent } from './list/modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { CreditCardModalComponent } from './list/modals/credit-card-modal/credit-card-modal.component';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadConfirmationModalComponent } from './list/modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { ReactivateModalComponent } from './list/modals/reactivate-modal/reactivate-modal.component';
import { UrgentConfirmationModalComponent } from './list/modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { CheckoutItemComponent } from './checkout/checkout-item/checkout-item.component';
import { BumpTutorialComponent } from './checkout/bump-tutorial/bump-tutorial.component';
import { BumpTutorialService } from './checkout/bump-tutorial/bump-tutorial.service';
import { TrackingModule } from '../core/tracking/tracking.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CatalogRoutingModule,
    MatIconModule,
    InfiniteScrollModule,
    MomentModule,
    ReactiveFormsModule,
    TrackingModule,
    NgbButtonsModule
  ],
  providers: [
    BumpTutorialService,
  ],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    SelectedItemsComponent,
    BumpConfirmationModalComponent,
    CreditCardModalComponent,
    UploadConfirmationModalComponent,
    ReactivateModalComponent,
    CheckoutItemComponent,
    BumpTutorialComponent,
    UrgentConfirmationModalComponent
  ],
  entryComponents: [
    BumpConfirmationModalComponent,
    CreditCardModalComponent,
    UploadConfirmationModalComponent,
    ReactivateModalComponent,
    UrgentConfirmationModalComponent
  ]
})
export class CatalogModule {
}
