import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_EMPTY } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryAddressErrorService } from '../../services/address/delivery-address-error/delivery-address-error.service';
import { DeliveryAddressStoreService } from '../../services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { DeliveryLocationsStoreService } from '../../services/locations/delivery-locations-store/delivery-locations-store.service';
import { DeliveryLocationsService } from '../../services/locations/delivery-locations/delivery-locations.service';
import { FormBuilder } from '@angular/forms';
import { DeliveryAddressComponent } from './delivery-address.component';
import { DeliveryCountriesApiService } from '../../services/api/delivery-countries-api/delivery-countries-api.service';
import { DeliveryLocationsApiService } from '../../services/api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryAddressApiService } from '../../services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryCountriesStoreService } from '../../services/countries/delivery-countries-store/delivery-countries-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MOCK_DELIVERY_LOCATION_AS_OPTION, MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';

describe('DeliveryAddressComponent', () => {
  let component: DeliveryAddressComponent;
  let fixture: ComponentFixture<DeliveryAddressComponent>;
  let deliveryAddressService: DeliveryAddressService;
  let deliveryLocationsService: DeliveryLocationsService;
  let deliveryCountriesService: DeliveryCountriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbModalModule, HttpClientTestingModule],
      declarations: [DeliveryAddressComponent, ProfileFormComponent],
      providers: [
        FormBuilder,
        I18nService,
        DeliveryAddressErrorService,
        ErrorsService,
        DeliveryCountriesService,
        DeliveryAddressStoreService,
        DeliveryCountriesStoreService,
        DeliveryLocationsStoreService,
        DeliveryAddressApiService,
        DeliveryCountriesApiService,
        DeliveryLocationsApiService,
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return 'FAKE_UUID';
            },
          },
        },
        ToastService,
        DeliveryLocationsService,
        {
          provide: ProfileFormComponent,
          useValue: {
            initFormControl() {},
            canExit() {},
          },
        },
        {
          provide: DeliveryAddressService,
          useValue: {
            get() {
              return of(MOCK_DELIVERY_ADDRESS);
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressComponent);
    deliveryAddressService = TestBed.inject(DeliveryAddressService);
    deliveryLocationsService = TestBed.inject(DeliveryLocationsService);
    deliveryCountriesService = TestBed.inject(DeliveryCountriesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initForm', () => {
    describe('and the petition succeed...', () => {
      describe('and we have a delivery address...', () => {
        beforeEach(() => {
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));
          spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(
            of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT)
          );
          spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
          spyOn(component.formComponent, 'initFormControl');

          component.initForm();
        });

        it('should prepare the form', () => {
          expect(component.isNewForm).toBe(false);
          expect(component.formComponent.initFormControl).toHaveBeenCalled();
        });

        it('should initialize the cities regarding our postal code', () => {
          expect(deliveryLocationsService.getLocationsByPostalCodeAndCountry).toHaveBeenCalledWith(
            MOCK_DELIVERY_ADDRESS.postal_code,
            MOCK_DELIVERY_ADDRESS.country_iso_code
          );
          expect(component.cities).toStrictEqual([MOCK_DELIVERY_LOCATION_AS_OPTION]);
        });

        it('should request the available countries and initialize them', () => {
          expect(component.countries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.countryOptions);
        });

        it('should patch the form with the requested info', () => {
          expect(component.deliveryAddressForm.getRawValue()).toEqual({
            ...MOCK_DELIVERY_ADDRESS,
          });
        });
      });

      describe(`and don't we have a delivery address...`, () => {
        beforeEach(() => {
          spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(
            of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT)
          );
          spyOn(deliveryAddressService, 'get').and.returnValue(of(null));
          spyOn(component.formComponent, 'initFormControl');

          component.initForm();
        });

        it('should prepare the form...', () => {
          expect(component.isNewForm).toBe(true);
          expect(component.formComponent.initFormControl).toHaveBeenCalled();
        });

        it('should build the form...', () => {
          expect(component.deliveryAddressForm.getRawValue()).toEqual(MOCK_DELIVERY_ADDRESS_EMPTY);
        });

        it('should request the available countries and initialize them', () => {
          expect(component.countries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.countryOptions);
        });

        it('should set the default country value...', () => {
          expect(component.deliveryAddressForm.get('country_iso_code').value).toBe(
            MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.defaultCountry.iso_code
          );
        });
      });
    });

    describe('and the petition fails...', () => {
      beforeEach(() => {
        spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT));
        spyOn(deliveryAddressService, 'get').and.returnValue(throwError('network error!'));
        spyOn(component.formComponent, 'initFormControl');

        component.initForm();
      });

      it('should prepare the form...', () => {
        expect(component.isNewForm).toBe(true);
        expect(component.formComponent.initFormControl).toHaveBeenCalled();
      });

      it('should build the form...', () => {
        expect(component.deliveryAddressForm.getRawValue()).toEqual(MOCK_DELIVERY_ADDRESS_EMPTY);
      });

      it('should request the available countries and initialize them', () => {
        expect(component.countries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.countryOptions);
      });

      it('should set the default country value...', () => {
        expect(component.deliveryAddressForm.get('country_iso_code').value).toBe(
          MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.defaultCountry.iso_code
        );
      });
    });
  });

  describe('onSubmit', () => {
    describe('when the form is valid...', () => {
      describe('and the save succeed...', () => {
        it('should update the delivery address in the store', () => {});
        it('should init the form control', () => {});

        describe('when redirecting to the next page...', () => {
          it('should redirect to X if we come from Y', () => {});
          it('should redirect to X if we come from Y', () => {});
          it('should redirect to X if we come from Y', () => {});
        });
      });

      describe('and the save fails...', () => {
        it('should set errors if the backend return an invalid field', () => {});
      });
    });

    describe('when the form is NOT valid...', () => {
      it('should show a toast with a form field error message', () => {});
      it('should mark as dirty the invalid form controls', () => {});
    });
  });
});
