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
import { CatalogManagerApiModule } from '@api/catalog-manager/catalog-manager-api.module';
import { MeApiModule } from '@api/me/me-api.module';
import { NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { ReviewsModule } from '../reviews/reviews.module';

@NgModule({
  declarations: [CheckoutItemComponent, CartComponent, WallacoinComponent, bumpsRoutedComponents],
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
    SharedModule,
    FormsModule,
    NgbButtonsModule,
    NgbTooltipModule,
    ReviewsModule,
    NavLinksModule,
    CatalogManagerApiModule,
    MeApiModule,
  ],
})
export class BumpsModule {}
