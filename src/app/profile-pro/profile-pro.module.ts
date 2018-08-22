import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { profileProRoutedComponents, ProfileProRoutingModule } from './profile-pro.routes';
import { DeleteInfoConfirmationModalComponent } from './profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { SubscriptionIconPipe } from './profile-pro-subscription/subscription-icon.pipe';
import { VisibilityProductsModalComponent } from './profile-pro-subscription/visibility-products-modal/visibility-products-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileProRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GeolocationModule,
    MatIconModule
  ],
  declarations: [
    profileProRoutedComponents,
    VisibilityProductsModalComponent,
    SubscriptionIconPipe,
    DeleteInfoConfirmationModalComponent
  ],
  entryComponents: [DeleteInfoConfirmationModalComponent, VisibilityProductsModalComponent]
})
export class ProfileProModule { }
