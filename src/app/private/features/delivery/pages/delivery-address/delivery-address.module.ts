import { NgModule } from '@angular/core';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { deliveryAddressRoutedComponents, DeliveryAddressRoutingModule } from './delivery-address.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { DeliveryAddressService } from '../../services/delivery-address/delivery-address.service';
import { DeliveryCountriesService } from '../../services/delivery-countries/delivery-countries.service';
import { ErrorsService } from '@core/errors/errors.service';
import { DeliveryAddressApiService } from '../../services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryCountriesApiService } from '../../services/api/delivery-countries-api/delivery-countries-api.service';
import { ButtonModule } from '@shared/button/button.module';
import { DeliveryLocationService } from '../../services/delivery-location/delivery-location.service';
import { DeliveryLocationApiService } from '../../services/api/delivery-location-api/delivery-location-api.service';

@NgModule({
  imports: [DeliveryAddressRoutingModule, ProfileFormModule, SpinnerModule, ReactiveFormsModule, DropdownModule, ButtonModule],
  declarations: [deliveryAddressRoutedComponents],
  providers: [
    DeliveryAddressService,
    DeliveryAddressApiService,
    DeliveryCountriesService,
    DeliveryCountriesApiService,
    DeliveryLocationService,
    DeliveryLocationApiService,
    ErrorsService,
  ],
})
export class DeliveryAddressModule {}
