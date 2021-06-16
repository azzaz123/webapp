import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_DELIVERY_ADDRESS,
  MOCK_INVALID_DELIVERY_ADDRESS,
  MOCK_DELIVERY_ADDRESS_EMPTY,
  MOCK_DELIVERY_ADDRESS_2,
  MOCK_DELIVERY_ADDRESS_RESET,
} from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
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
import {
  MOCK_DELIVERY_LOCATION_AS_OPTION,
  MOCK_DELIVERY_LOCATION_ES,
  MOCK_DELIVERY_LOCATION,
} from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { PostalCodeDoesNotExistError, PostalCodeIsInvalidError, PostalCodeIsNotAllowedError } from '../../errors/classes/postal-codes';
import { FlatAndFloorTooLongError, MobilePhoneNumberIsInvalidError, UniqueAddressByUserError } from '../../errors/classes/address';
import { DeliveryAddressTrackEventsService } from '../../services/address/delivery-address-track-events/delivery-address-track-events.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '../../enums/delivery-address-previous-pages.enum';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';

describe('DeliveryAddressComponent', () => {
  const payViewMessageSelector = '.DeliveryAddress__payViewInfoMessage';
  const countriesDropdownSelector = '#country_iso_code';
  const deleteButtonSelector = '#deleteButton';
  let component: DeliveryAddressComponent;
  let fixture: ComponentFixture<DeliveryAddressComponent>;
  let deliveryAddressTrackEventsService: DeliveryAddressTrackEventsService;
  let deliveryLocationsService: DeliveryLocationsService;
  let deliveryCountriesService: DeliveryCountriesService;
  let deliveryAddressService: DeliveryAddressService;
  let toastService: ToastService;
  let i18nService: I18nService;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbModalModule, HttpClientTestingModule],
      declarations: [DeliveryAddressComponent, ProfileFormComponent, DropdownComponent, NumbersOnlyDirective],
      providers: [
        FormBuilder,
        I18nService,
        ToastService,
        DeliveryCountriesService,
        DeliveryCountriesStoreService,
        DeliveryAddressApiService,
        DeliveryCountriesApiService,
        DeliveryLocationsApiService,
        {
          provide: DeliveryAddressTrackEventsService,
          useValue: {
            trackClickSaveButton() {},
          },
        },
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
            create() {
              return of();
            },
            update() {
              return of();
            },
            delete() {
              return of();
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressComponent);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal);
    i18nService = TestBed.inject(I18nService);
    toastService = TestBed.inject(ToastService);
    deliveryAddressService = TestBed.inject(DeliveryAddressService);
    deliveryLocationsService = TestBed.inject(DeliveryLocationsService);
    deliveryCountriesService = TestBed.inject(DeliveryCountriesService);
    deliveryAddressTrackEventsService = TestBed.inject(DeliveryAddressTrackEventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initForm when init...', () => {
    describe('and the petition succeed...', () => {
      describe('and we have a delivery address...', () => {
        beforeEach(() => {
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));
          spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(
            of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT)
          );
          spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
          spyOn(component.formComponent, 'initFormControl');

          component.ngOnInit();
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

        describe('and we save the address...', () => {
          beforeEach(() => {
            spyOn(deliveryAddressService, 'update').and.returnValue(of());
            component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS_2);

            component.onSubmit();
          });

          it('should update the address', () => {
            expect(deliveryAddressService.update).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS_2);
          });
        });
      });

      describe(`and we don't have a delivery address...`, () => {
        beforeEach(() => {
          spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(
            of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT)
          );
          spyOn(deliveryAddressService, 'get').and.returnValue(of(null));
          spyOn(component.formComponent, 'initFormControl');

          component.ngOnInit();
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

        describe('and we save the address...', () => {
          beforeEach(() => {
            spyOn(deliveryAddressService, 'create').and.returnValue(of());
            component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS_2);

            component.onSubmit();
          });

          it('should create the address', () => {
            expect(deliveryAddressService.create).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS_2);
          });
        });
      });
    });

    describe('and the petition fails...', () => {
      beforeEach(() => {
        spyOn(deliveryCountriesService, 'getCountriesAsOptionsAndDefault').and.returnValue(of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT));
        spyOn(deliveryAddressService, 'get').and.returnValue(throwError('network error!'));
        spyOn(component.formComponent, 'initFormControl');

        component.ngOnInit();
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
      beforeEach(() => {
        component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS_2);
      });

      describe('and the save succeed...', () => {
        beforeEach(() => {
          spyOn(deliveryAddressService, 'update').and.returnValue(of(null));
          spyOn(deliveryAddressTrackEventsService, 'trackClickSaveButton');
          spyOn(toastService, 'show');
          spyOn(component, 'initForm');
          spyOn(router, 'navigate');
        });

        it('should call the event track save click event', () => {
          component.onSubmit();

          expect(deliveryAddressTrackEventsService.trackClickSaveButton).toHaveBeenCalled();
        });

        it('should show a success message', () => {
          component.onSubmit();

          expect(toastService.show).toHaveBeenCalledWith({
            text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_EDIT_SUCCESS),
            type: 'success',
          });
        });

        it('should update the new form flag to false', () => {
          component.onSubmit();

          expect(component.isNewForm).toBe(false);
        });

        describe('when redirecting to the next page...', () => {
          it('should redirect to the payview if we come from payview add address button', () => {
            component.whereUserComes = DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS;

            component.onSubmit();

            expect(router.navigate).toHaveBeenCalledWith([DELIVERY_PATHS.PAYVIEW]);
          });

          it('should redirect to shipment tracking if we come from payview pay button', () => {
            component.whereUserComes = DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_PAY;

            component.onSubmit();

            expect(router.navigate).toHaveBeenCalledWith([DELIVERY_PATHS.SHIPMENT_TRACKING]);
          });

          it('should stay at the same page by default', () => {
            component.whereUserComes = null;

            component.onSubmit();

            expect(router.navigate).not.toHaveBeenCalled();
          });
        });
      });

      describe('and the save fails...', () => {
        describe('and when the fail is because server notifies flat and floor too long and mobile phone number is invalid', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
            spyOn(deliveryAddressService, 'update').and.returnValue(
              throwError([new MobilePhoneNumberIsInvalidError(), new FlatAndFloorTooLongError()])
            );

            component.onSubmit();
          });

          it('should show error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_MISSING_INFO_ERROR),
              type: 'error',
            });
          });

          it('should mark form as pending', () => {
            expect(component.deliveryAddressForm.pending).toBe(true);
          });

          it('should set phone number invalid error', () => {
            expect(component.deliveryAddressForm.get('phone_number').getError('invalid')).toBeTruthy();
          });

          it('should set flat and floor invalid error', () => {
            expect(component.deliveryAddressForm.get('flat_and_floor').getError('invalid')).toBeTruthy();
          });
        });

        describe('and when the fail is because server notifies postal code is invalid and not exists', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
            spyOn(deliveryAddressService, 'update').and.returnValue(
              throwError([new PostalCodeIsInvalidError(), new PostalCodeDoesNotExistError()])
            );

            component.onSubmit();
          });

          it('should mark form as pending', () => {
            expect(component.deliveryAddressForm.pending).toBe(true);
          });

          it('should show error toast with generic error', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR),
              type: 'error',
            });
          });

          it('should set postal code error', () => {
            expect(component.deliveryAddressForm.get('postal_code').getError('invalid')).toBeTruthy();
          });
        });

        describe('and when the fail is because server notifies unique address by user', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
            spyOn(deliveryAddressService, 'update').and.returnValue(throwError([new UniqueAddressByUserError('Unique address violation')]));

            component.onSubmit();
          });

          it('should not mark form as pending', () => {
            expect(component.deliveryAddressForm.pending).toBe(false);
          });

          it('should show toast with generic error', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR),
              type: 'error',
            });
          });
        });
      });
    });

    describe('when the form is NOT valid...', () => {
      beforeEach(() => {
        spyOn(toastService, 'show');
        spyOn(deliveryAddressTrackEventsService, 'trackClickSaveButton');
        spyOn(component, 'onSubmit').and.callThrough();
        component.deliveryAddressForm.patchValue(MOCK_INVALID_DELIVERY_ADDRESS);

        component.onSubmit();
      });

      it('should call the event track save click event ', () => {
        expect(deliveryAddressTrackEventsService.trackClickSaveButton).toHaveBeenCalled();
      });

      it('should show a toast with a form field error message', () => {
        expect(toastService.show).toHaveBeenCalledWith({
          text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_MISSING_INFO_ERROR),
          type: 'error',
        });
      });

      it('should mark as dirty the invalid form controls', () => {
        expect(component.deliveryAddressForm.get('street').valid).toBe(false);
        expect(component.deliveryAddressForm.get('street').dirty).toBe(true);

        expect(component.deliveryAddressForm.get('phone_number').valid).toBe(false);
        expect(component.deliveryAddressForm.get('phone_number').dirty).toBe(true);

        expect(component.deliveryAddressForm.get('postal_code').valid).toBe(false);
        expect(component.deliveryAddressForm.get('postal_code').dirty).toBe(true);
      });
    });
  });

  describe('when the user comes from the pay on payview...', () => {
    beforeEach(() => {
      spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
      spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));
      component.whereUserComes = DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_PAY;

      component.ngOnInit();
      component.initForm();
      fixture.detectChanges();
    });

    it('should show an info message', () => {
      expect(fixture.debugElement.query(By.css(payViewMessageSelector))).toBeTruthy();
    });

    it('should not appear the delete button', () => {
      expect(fixture.debugElement.query(By.css(deleteButtonSelector))).toBeFalsy();
    });
  });

  describe('when the user NOT comes from the pay button on payview...', () => {
    beforeEach(() => {
      spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
      spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));
      component.whereUserComes = DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS;

      component.ngOnInit();
      component.initForm();
      fixture.detectChanges();
    });

    it('should NOT show an info message', () => {
      expect(fixture.debugElement.query(By.css(payViewMessageSelector))).toBeFalsy();
    });

    it('should not appear the delete button', () => {
      expect(fixture.debugElement.query(By.css(deleteButtonSelector))).toBeFalsy();
    });
  });

  describe('when the user NOT comes from the payview...', () => {
    it('should appear the delete button', () => {
      spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
      spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));
      component.whereUserComes = null;

      component.ngOnInit();
      component.initForm();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(deleteButtonSelector))).toBeTruthy();
    });
  });

  describe('when clicking in the countries dropdown...', () => {
    beforeEach(() => {
      spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
      spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));

      component.initForm();
      fixture.detectChanges();
    });

    describe('and the form is not a new one... ', () => {
      describe('and the user did not accept the terms yet...', () => {
        beforeEach(() => {
          component.countries = MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.countryOptions;
          component.isNewForm = false;
          component.isCountryEditable = false;
        });

        it('should open the change country confirmation modal', () => {
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });

          fixture.debugElement.query(By.css(countriesDropdownSelector)).nativeElement.click();

          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        });

        describe('when we click on accept on the change country confirmation modal ', () => {
          beforeEach(() => {
            spyOn(component.countriesDropdown, 'open');
            spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });
          });

          it('should make the country editable and open the dropdown again', fakeAsync(() => {
            fixture.debugElement.query(By.css(countriesDropdownSelector)).nativeElement.click();
            tick();

            expect(component.isCountryEditable).toBe(true);
            expect(component.countriesDropdown.open).toHaveBeenCalled();
          }));
        });

        describe('when we click on cancel on the change country confirmation modal ', () => {
          beforeEach(() => {
            spyOn(component.countriesDropdown, 'open');
            spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance: { ConfirmationModalComponent } });

            fixture.debugElement.query(By.css(countriesDropdownSelector)).nativeElement.click();
          });

          it('should NOT make the country editable and should NOT open the countries dropdown', fakeAsync(() => {
            tick();

            expect(component.isCountryEditable).toBe(false);
            expect(component.countriesDropdown.open).not.toHaveBeenCalled();
          }));
        });
      });

      describe('and the user already accepted the terms...', () => {
        it('should open the dropdown', fakeAsync(() => {
          spyOn(component.countriesDropdown, 'open');
          component.countries = MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.countryOptions;
          component.isNewForm = false;
          component.isCountryEditable = true;

          fixture.debugElement.query(By.css(countriesDropdownSelector)).nativeElement.click();
          tick();

          expect(component.countriesDropdown.open).not.toHaveBeenCalled();
        }));
      });
    });

    describe('and the form is a new one... ', () => {
      it('should open the dropdown', fakeAsync(() => {
        spyOn(component.countriesDropdown, 'open');
        component.isNewForm = true;

        fixture.debugElement.query(By.css(countriesDropdownSelector)).nativeElement.click();
        tick();

        expect(component.isCountryEditable).toBe(false);
        expect(component.countriesDropdown.open).not.toHaveBeenCalled();
      }));
    });
  });

  describe('when the country changes...', () => {
    beforeEach(() => {
      component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS);
      const countryFormControl = component.deliveryAddressForm.get('country_iso_code');
      countryFormControl.markAsDirty();
      countryFormControl.setValue('IT');
    });

    it('should clear the form', () => {
      expect(component.deliveryAddressForm.getRawValue()).toStrictEqual({
        id: MOCK_DELIVERY_ADDRESS.id,
        city: null,
        country_iso_code: 'IT',
        flat_and_floor: null,
        full_name: null,
        phone_number: null,
        postal_code: null,
        region: null,
        street: null,
      });
    });

    it('should reset the locations', () => {
      expect(component.locations).toStrictEqual([]);
    });

    it('should reset the cities', () => {
      expect(component.cities).toStrictEqual([]);
    });
  });

  describe('when the postal code changes...', () => {
    beforeEach(() => {
      component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS);
      component.deliveryAddressForm.get('postal_code').markAsDirty();
    });

    it('should reset the locations', () => {
      expect(component.locations).toStrictEqual([]);
    });

    it('should reset the cities', () => {
      expect(component.cities).toStrictEqual([]);
    });

    describe('and the postal code is valid and have five digits...', () => {
      describe('and the backend returns only one location...', () => {
        beforeEach(() => {
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));

          component.deliveryAddressForm.get('postal_code').setValue('08016');
        });

        it('should request the new locations by postal code and country', () => {
          expect(deliveryLocationsService.getLocationsByPostalCodeAndCountry).toHaveBeenCalledWith(
            '08016',
            MOCK_DELIVERY_ADDRESS.country_iso_code
          );
        });

        it('should initialize the cities as options', () => {
          expect(component.cities).toStrictEqual([MOCK_DELIVERY_LOCATION_AS_OPTION]);
        });

        it('should set the new city and the new region', () => {
          expect(component.deliveryAddressForm.get('city').value).toStrictEqual(MOCK_DELIVERY_LOCATION.city);
          expect(component.deliveryAddressForm.get('region').value).toStrictEqual(MOCK_DELIVERY_LOCATION.region);
        });
      });

      describe('and the backend returns only multiples locations...', () => {
        beforeEach(() => {
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(
            of([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION])
          );

          component.deliveryAddressForm.get('postal_code').setValue('08040');
        });

        it('should request the new locations by postal code and country', () => {
          expect(deliveryLocationsService.getLocationsByPostalCodeAndCountry).toHaveBeenCalledWith(
            '08040',
            MOCK_DELIVERY_ADDRESS.country_iso_code
          );
        });

        it('should initialize the cities as options', () => {
          expect(component.cities).toStrictEqual([MOCK_DELIVERY_LOCATION_AS_OPTION, MOCK_DELIVERY_LOCATION_AS_OPTION]);
        });

        it('should NOT set the city and the region', () => {
          expect(component.deliveryAddressForm.get('city').value).toStrictEqual(null);
          expect(component.deliveryAddressForm.get('region').value).toStrictEqual(null);
        });
      });

      describe('and the backend NOT returns locations...', () => {
        beforeEach(fakeAsync(() => {
          spyOn(i18nService, 'translate');
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([]));

          component.deliveryAddressForm.get('postal_code').setValue('08040');
          tick();
        }));

        it('should mark the postal code as invalid', () => {
          expect(component.deliveryAddressForm.get('postal_code').getError('invalid')).toBeTruthy();
        });

        it('should show an error message', () => {
          expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_EXISTS_ERROR);
        });
      });

      describe('and the backend fails for an postal code invalid error...', () => {
        const postalCodeError = new PostalCodeIsNotAllowedError('');

        beforeEach(() => {
          spyOn(i18nService, 'translate');
          spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(throwError([postalCodeError]));

          component.deliveryAddressForm.get('postal_code').setValue('08040');
        });

        it('should mark the postal code as invalid', () => {
          expect(component.deliveryAddressForm.get('postal_code').getError('invalid')).toBeTruthy();
        });

        it('should show an error message', () => {
          expect(component.formErrorMessages.postal_code).toEqual(postalCodeError.message);
        });
      });
    });

    describe('and is not valid or not have five digits...', () => {
      it('should reset the city and the region', () => {
        component.deliveryAddressForm.get('postal_code').setValue('06');
        spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry');

        expect(deliveryLocationsService.getLocationsByPostalCodeAndCountry).not.toHaveBeenCalled();
        expect(component.deliveryAddressForm.get('city').value).toBe(null);
        expect(component.deliveryAddressForm.get('region').value).toBe(null);
      });
    });
  });

  describe('when the city changes...', () => {
    beforeEach(() => {
      component.deliveryAddressForm.patchValue(MOCK_DELIVERY_ADDRESS);
    });

    describe('and we have the searched locations...', () => {
      it('should update the region', () => {
        component.locations = [MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION_ES];

        const cityFormControl = component.deliveryAddressForm.get('city');
        cityFormControl.markAsDirty();
        cityFormControl.setValue('Málaga');

        expect(component.deliveryAddressForm.get('region').value).toBe(MOCK_DELIVERY_LOCATION_ES.region);
      });
    });
  });

  describe('when clicking the delete button...', () => {
    beforeEach(() => {
      spyOn(deliveryAddressService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));
      spyOn(deliveryLocationsService, 'getLocationsByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION]));

      component.initForm();
      fixture.detectChanges();
    });

    describe('and we confirm the action...', () => {
      describe('and the delete action succeed...', () => {
        beforeEach(() => {
          component.deliveryAddressForm.setValue(MOCK_DELIVERY_ADDRESS);

          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });
          spyOn(toastService, 'show');
          spyOn(component.formComponent, 'initFormControl');
          spyOn(deliveryAddressService, 'delete').and.returnValue(of(null));

          fixture.debugElement.query(By.css(deleteButtonSelector)).nativeElement.click();
        });

        it('should open confirmation modal', () => {
          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        });

        it('should prepare form and set the default country', fakeAsync(() => {
          tick();

          expect(component.isNewForm).toBe(true);
          expect(component.formComponent.initFormControl).toHaveBeenCalled();
          expect(component.deliveryAddressForm.get('country_iso_code').value).toBe(
            MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT.defaultCountry.iso_code
          );
        }));

        it('should call the delete action with the address id', fakeAsync(() => {
          tick();

          expect(deliveryAddressService.delete).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS.id);
        }));

        it('should show a success toast message', fakeAsync(() => {
          tick();

          expect(toastService.show).toHaveBeenCalledWith({
            text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_DELETE_SUCCESS),
            type: 'success',
          });
        }));

        it('should clear the form', fakeAsync(() => {
          tick();

          expect(component.deliveryAddressForm.value).toStrictEqual(MOCK_DELIVERY_ADDRESS_RESET);
        }));

        it('should reset the id', fakeAsync(() => {
          tick();

          expect(component.deliveryAddressForm.get('id').value).not.toStrictEqual(MOCK_DELIVERY_ADDRESS.id);
        }));
      });

      describe('and the delete action fails...', () => {
        beforeEach(() => {
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });
          spyOn(deliveryAddressService, 'delete').and.returnValue(throwError('network error'));
          spyOn(toastService, 'show');

          fixture.debugElement.query(By.css(deleteButtonSelector)).nativeElement.click();
        });

        it('should open confirmation modal', () => {
          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        });

        it('should call the delete action with the address id', fakeAsync(() => {
          tick();

          expect(deliveryAddressService.delete).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS.id);
        }));

        it('should show an error toast message', fakeAsync(() => {
          tick();

          expect(toastService.show).toHaveBeenCalledWith({
            text: i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR),
            type: 'error',
          });
        }));
      });
    });

    describe('and we NOT confirm the action...', () => {
      beforeEach(() => {
        spyOn(deliveryAddressService, 'delete');
        spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance: { ConfirmationModalComponent } });

        fixture.debugElement.query(By.css(deleteButtonSelector)).nativeElement.click();
      });

      it('should open the delete confirmation modal', fakeAsync(() => {
        tick();

        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
      }));

      it('should NOT call the service', fakeAsync(() => {
        tick();

        expect(deliveryAddressService.delete).not.toHaveBeenCalled();
      }));
    });
  });
});
