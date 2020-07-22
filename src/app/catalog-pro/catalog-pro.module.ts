import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { catalogProRoutedComponents, CatalogProRoutingModule } from './catalog-pro.routes';
import { ProBumpConfirmationModalComponent } from './catalog-pro-list/modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { ProUrgentConfirmationModalComponent } from './catalog-pro-list/modals/pro-urgent-confirmation-modal/pro-urgent-confirmation-modal.component';
import { PlanDataComponent } from './catalog-pro-list/plan-data/plan-data.component';
import { CartExtrasProComponent } from './checkout-extras-pro/cart-extras-pro/cart-extras-pro.component';
import { CheckoutExtrasProItemComponent } from './checkout-extras-pro/checkout-extras-pro-item/checkout-extras-pro-item.component';
import { CartProComponent } from './checkout-pro/cart-pro/cart-pro.component';
import { CheckoutProItemComponent } from './checkout-pro/checkout-pro-item/checkout-pro-item.component';
import { RangeDatepickerComponent } from './checkout-pro/range-datepicker/range-datepicker.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CreditCardModalComponent } from './catalog-pro-list/modals/credit-card-modal/credit-card-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CatalogProRoutingModule,
    InfiniteScrollModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule
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
    CreditCardModalComponent
  ],
  entryComponents: [
    ProBumpConfirmationModalComponent,
    ProUrgentConfirmationModalComponent,
    CreditCardModalComponent
  ]
})
export class CatalogProModule { }
