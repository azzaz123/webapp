import { NgModule } from '@angular/core';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { deliveryAddressRoutedComponents, DeliveryAddressRoutingModule } from './delivery-address.routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [DeliveryAddressRoutingModule, ProfileFormModule, SpinnerModule, ReactiveFormsModule],
  declarations: [deliveryAddressRoutedComponents],
})
export class DeliveryAddressModule {}
