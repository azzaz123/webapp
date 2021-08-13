import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProComponent } from './pages/pro.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ProRoutingModule } from './pro.routes';
import { NgbAccordionModule, NgbCarouselModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SubscriptionTierSelectorComponent } from './pages/subscription/subscription-tier-selector/subscription-tier-selector.component';
import { SubscriptionCardSelectorComponent } from './pages/subscription/subscription-card-selector/subscription-card-selector.component';
import { SubscriptionPurchaseFooterComponent } from './pages/subscription/subscription-purchase-footer/subscription-purchase-footer.component';
import { SubscriptionPurchaseComponent } from './pages/subscription/subscription-purchase/subscription-purchase.component';
import { SubscriptionPurchaseHeaderComponent } from './pages/subscription/subscription-purchase-header/subscription-purchase-header.component';
import { SubscriptionCardComponent } from './pages/subscription/subscription-card/subscription-card.component';
import { SubscriptionListComponent } from './pages/subscription/subscription-list/subscription-list.component';
import { SubscriptionPriceDiscountComponent } from './components/subscription-price-discount/subscription-price-discount.component';
import { InvoiceHistoryComponent } from './components/invoice-history/invoice-history.component';
import { InvoiceItemComponent } from './components/invoice-item/invoice-item.component';
import { SubscriptionBenefitComponent } from './components/subscription-benefits/subscription-benefit/subscription-benefit.component';
import { SubscriptionsComponent } from './pages/subscription/subscription.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ProfileProSubscriptionComponent } from './pages/profile-pro-subscription/profile-pro-subscription.component';
import { CancelSubscriptionModalComponent } from './modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from './modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from './modal/continue-subscription/continue-subscription-modal.component';
import { EditSubscriptionModalComponent } from './modal/edit-subscription/edit-subscription-modal.component';
import { PaymentSuccessModalComponent } from './modal/payment-success/payment-success-modal.component';
import { UnsubscribeInAppFirstModalComponent } from './modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { VisibilityProductsModalComponent } from './modal/visibility-products-modal/visibility-products-modal.component';
import { SubscriptionIconPipe } from '../profile/pipes/subscription-icon.pipe';
import { ProfileProBillingModule } from '@shared/profile-pro-billing/profile-pro-billing.module';
import { PaymentsCardInfoModule } from '@shared/payments-card-info/payments-card-info.module';
import { SubscriptionBenefitsComponent } from './components/subscription-benefits/subscription-benefits.component';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { HeaderModule } from '@shared/header/header.module';
import { SubscriptionPurchaseSuccessComponent } from './components/subscription-purchase-success/subscription-purchase-success.component';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [
    ProComponent,
    SubscriptionsComponent,
    InvoiceComponent,
    ProfileProSubscriptionComponent,
    SubscriptionPriceDiscountComponent,
    InvoiceHistoryComponent,
    InvoiceItemComponent,
    SubscriptionBenefitComponent,
    SubscriptionListComponent,
    SubscriptionCardComponent,
    SubscriptionPurchaseComponent,
    SubscriptionPurchaseHeaderComponent,
    SubscriptionPurchaseFooterComponent,
    SubscriptionTierSelectorComponent,
    SubscriptionCardSelectorComponent,
    SubscriptionPurchaseFooterComponent,
    VisibilityProductsModalComponent,
    PaymentSuccessModalComponent,
    EditSubscriptionModalComponent,
    CancelSubscriptionModalComponent,
    ContinueSubscriptionModalComponent,
    CheckSubscriptionInAppModalComponent,
    UnsubscribeInAppFirstModalComponent,
    SubscriptionIconPipe,
    SubscriptionBenefitsComponent,
    SubscriptionPurchaseSuccessComponent,
  ],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    RouterModule,
    ButtonModule,
    SvgIconModule,
    ProRoutingModule,
    NgbCarouselModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileProBillingModule,
    PaymentsCardInfoModule,
    SpinnerModule,
    HeaderModule,
    UserAvatarModule,
  ],
})
export class ProModule {}
