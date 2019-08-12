import { NgModule } from '@angular/core';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { SharedModule } from '../shared/shared.module';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { BecomeProModalComponent } from './become-pro-modal/become-pro-modal.component';
import { DeleteInfoConfirmationModalComponent } from './profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { SubscriptionIconPipe } from './profile-pro-subscription/subscription-icon.pipe';
import { VisibilityProductsModalComponent } from './profile-pro-subscription/visibility-products-modal/visibility-products-modal.component';
import { RequestNewPaymentModalComponent } from './subscription/modals/request-new-payment-modal.component';
import { AddNewSubscriptionModalComponent } from './subscription/modals/add-new-subscription-modal.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgbButtonsModule,
    GeolocationModule
  ],
  declarations: [
    profileRoutedComponents,
    BecomeProModalComponent,
    UnsubscribeModalComponent,
    DeleteInfoConfirmationModalComponent,
    SubscriptionIconPipe,
    VisibilityProductsModalComponent,
    RequestNewPaymentModalComponent,
    AddNewSubscriptionModalComponent
  ],
  entryComponents: [
    UnsubscribeModalComponent,
    BecomeProModalComponent,
    DeleteInfoConfirmationModalComponent,
    VisibilityProductsModalComponent,
    RequestNewPaymentModalComponent,
    AddNewSubscriptionModalComponent
  ]
})
export class ProfileModule { }
