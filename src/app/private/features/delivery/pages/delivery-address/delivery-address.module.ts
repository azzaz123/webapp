import { NgModule } from '@angular/core';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { deliveryAddressRoutedComponents, DeliveryAddressRoutingModule } from './delivery-address.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { ErrorsService } from '@core/errors/errors.service';
import { DeliveryAddressApiService } from '../../services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryCountriesApiService } from '../../services/api/delivery-countries-api/delivery-countries-api.service';
import { ButtonModule } from '@shared/button/button.module';
import { DeliveryLocationsService } from '../../services/locations/delivery-locations/delivery-locations.service';
import { DeliveryLocationsApiService } from '../../services/api/delivery-locations-api/delivery-locations-api.service';
import { CommonModule } from '@angular/common';
import { DeliveryAddressStoreService } from '../../services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryCountriesStoreService } from '../../services/countries/delivery-countries-store/delivery-countries-store.service';
import { DeliveryAddressTrackEventsService } from '../../services/address/delivery-address-track-events/delivery-address-track-events.service';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { DeliveryAddressResolver } from './resolvers/delivery-address.resolver';

@NgModule({
  imports: [
    DeliveryAddressRoutingModule,
    ProfileFormModule,
    SpinnerModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    NumbersOnlyDirectiveModule,
  ],
  declarations: [deliveryAddressRoutedComponents],
  providers: [
    DeliveryAddressService,
    DeliveryAddressApiService,
    DeliveryAddressStoreService,
    DeliveryCountriesService,
    DeliveryCountriesStoreService,
    DeliveryCountriesApiService,
    DeliveryLocationsService,
    DeliveryLocationsApiService,
    ErrorsService,
    DeliveryAddressTrackEventsService,
    DeliveryAddressResolver,
  ],
})
export class DeliveryAddressModule {}
