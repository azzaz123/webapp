import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbButtonsModule,
  NgbCarouselModule,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { DeleteInfoConfirmationModalComponent } from '@shared/profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { SharedModule } from '@shared/shared.module';
import { InvoiceHistoryComponent } from './components/invoice-history/invoice-history.component';
import { InvoiceItemComponent } from './components/invoice-item/invoice-item.component';
import { SubscriptionBenefitsComponent } from './components/subscription-benefits/subscription-benefits.component';
import { SubscriptionPriceDiscountComponent } from './components/subscription-price-discount/subscription-price-discount.component';
import { AddNewSubscriptionModalComponent } from './modal/add-new-subscription/add-new-subscription-modal.component';
import { BecomeProModalComponent } from './modal/become-pro-modal/become-pro-modal.component';
import { CancelSubscriptionModalComponent } from './modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from './modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from './modal/continue-subscription/continue-subscription-modal.component';
import { DiscountAvailableUnsubscribeInAppModalComponent } from './modal/discount-available-unsubscribe-in-app-modal/discount-available-unsubscribe-in-app-modal.component';
import { EditSubscriptionModalComponent } from './modal/edit-subscription/edit-subscription-modal.component';
import { PaymentSuccessModalComponent } from './modal/payment-success/payment-success-modal.component';
import { UnsubscribeInAppFirstModal } from './modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { UnsubscribeModalComponent } from './modal/unsubscribe-modal/unsubscribe-modal.component';
import { VisibilityProductsModalComponent } from './modal/visibility-products-modal/visibility-products-modal.component';
import { SubscriptionIconPipe } from './pipes/subscription-icon.pipe';
import {
  profileRoutedComponents,
  ProfileRoutingModule,
} from './profile.routes';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbButtonsModule,
    GeolocationModule,
    NgbCarouselModule,
    NgbAccordionModule,
    NgbModalModule,
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
    DiscountAvailableUnsubscribeInAppModalComponent,
    SubscriptionPriceDiscountComponent,
    InvoiceHistoryComponent,
    InvoiceItemComponent,
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
    DiscountAvailableUnsubscribeInAppModalComponent,
    InvoiceHistoryComponent,
    InvoiceItemComponent,
  ],
})
export class ProfileModule {}
