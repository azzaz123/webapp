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
import { PaymentSuccessModalComponent } from './subscription/modals/payment-success-modal.component';
import { AddNewSubscriptionModalComponent } from './subscription/modals/add-new-subscription-modal.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { EditSubscriptionModalComponent } from './subscription/modals/edit-subscription-modal.component';
import { CancelSubscriptionModalComponent } from './subscription/modals/cancel-subscription-modal.component';
import { ContinueSubscriptionModalComponent } from './subscription/modals/continue-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from './subscription/modals/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { UnsubscribeInAppFirstModal } from './subscription/modals/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { SubscriptionBenefitsComponent } from './subscription/subscription-benefits/subscription-benefits.component';
import { DiscountAvailableUnsubscribeInAppModalComponent } from './subscription/modals/discount-available-unsubscribe-in-app-modal/discount-available-unsubscribe-in-app-modal.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgbButtonsModule,
    GeolocationModule,
    NgbCarouselModule
  ],
  declarations: [
    profileRoutedComponents,
    SubscriptionBenefitsComponent,
    BecomeProModalComponent,
    UnsubscribeModalComponent,
    DeleteInfoConfirmationModalComponent,
    SubscriptionIconPipe,
    VisibilityProductsModalComponent,
    PaymentSuccessModalComponent,
    AddNewSubscriptionModalComponent,
    EditSubscriptionModalComponent,
    CancelSubscriptionModalComponent,
    ContinueSubscriptionModalComponent,
    CheckSubscriptionInAppModalComponent,
    UnsubscribeInAppFirstModal,
    DiscountAvailableUnsubscribeInAppModalComponent
  ],
  entryComponents: [
    UnsubscribeModalComponent,
    BecomeProModalComponent,
    DeleteInfoConfirmationModalComponent,
    VisibilityProductsModalComponent,
    PaymentSuccessModalComponent,
    AddNewSubscriptionModalComponent,
    EditSubscriptionModalComponent,
    CancelSubscriptionModalComponent,
    ContinueSubscriptionModalComponent,
    CheckSubscriptionInAppModalComponent,
    UnsubscribeInAppFirstModal,
    DiscountAvailableUnsubscribeInAppModalComponent
  ]
})
export class ProfileModule { }
