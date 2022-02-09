import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutItemComponent } from './components/checkout-item/checkout-item.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@shared/button/button.module';
import { CartComponent } from './components/cart/cart.component';
import { WallacoinComponent } from './components/wallacoin/wallacoin.component';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bumpsRoutedComponents, BumpsRoutingModule } from './bumps.routing.module';
import { BumpTutorialModule } from '@shared/bump-tutorial/bump-tutorial.module';
import { SharedModule } from '@shared/shared.module';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { VisibilityApiModule } from '@api/visibility/visibility-api.module';
import { SubscriptionHeaderCheckoutComponent } from './components/subscription-header-checkout/subscription-header-checkout.component';

@NgModule({
  declarations: [CheckoutItemComponent, CartComponent, WallacoinComponent, bumpsRoutedComponents, SubscriptionHeaderCheckoutComponent],
  imports: [
    CommonModule,
    SvgIconModule,
    ItemAvatarModule,
    SpinnerModule,
    RouterModule,
    ButtonModule,
    CustomCurrencyModule,
    FormsModule,
    ReactiveFormsModule,
    BumpsRoutingModule,
    BumpTutorialModule,
    SharedModule,
    NavLinksModule,
    NgbButtonsModule,
    ToggleFormModule,
    ProBadgeModule,
    VisibilityApiModule,
  ],
})
export class BumpsModule {}
