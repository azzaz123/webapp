import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  catalogProRoutedComponents,
  CatalogProRoutingModule,
} from './catalog-pro.routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CartExtrasProComponent } from './components/cart-extras-pro/cart-extras-pro.component';
import { CartProComponent } from './components/cart-pro/cart-pro.component';
import { CheckoutExtrasProItemComponent } from './components/checkout-extras-pro-item/checkout-extras-pro-item.component';
import { CheckoutProItemComponent } from './components/checkout-pro-item/checkout-pro-item.component';
import { PlanDataComponent } from './components/plan-data/plan-data.component';
import { RangeDatepickerComponent } from './components/range-datepicker/range-datepicker.component';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';
import { ProBumpConfirmationModalComponent } from './modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { ProUrgentConfirmationModalComponent } from './modals/pro-urgent-confirmation-modal/pro-urgent-confirmation-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CatalogProRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
  ],
  declarations: [
    catalogProRoutedComponents,
    ProBumpConfirmationModalComponent,
    ProUrgentConfirmationModalComponent,
    PlanDataComponent,
    CartExtrasProComponent,
    CheckoutExtrasProItemComponent,
    CartProComponent,
    CheckoutProItemComponent,
    RangeDatepickerComponent,
    CreditCardModalComponent,
  ],
  entryComponents: [
    ProBumpConfirmationModalComponent,
    ProUrgentConfirmationModalComponent,
    CreditCardModalComponent,
  ],
})
export class CatalogProModule {}
