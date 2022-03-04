import { TestBed } from '@angular/core/testing';
import { DeliveryMapService } from './delivery-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@core/user/user.service';
import { MOCK_OTHER_USER, MOCK_USER, MOCK_USER_WITHOUT_LOCATION } from '@fixtures/user.fixtures.spec';
import { CarrierOfficesApiService } from '@api/bff/delivery/carrier-offices/carrier-offices-api.service';
import { of } from 'rxjs';
import { CarrierOfficeAddressesApiService } from '@api/delivery/me/carrier-office-addresses/carrier-office-addresses-api.service';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { MockGeolocationService } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import {
  MOCK_LOCATION,
  MOCK_FULL_ADDRESS,
  MOCK_LOCATION_WITH_RADIUS,
  MOCK_USER_LOCATION_WITH_RADIUS,
  MOCK_FALLBACK_LOCATION_WITH_RADIUS,
  MOCK_CARRIER_OFFICE_INFO_LOCATION,
  MOCK_USER_LOCATION,
  MOCK_FALLBACK_LOCATION,
  MOCK_OFFICE_MARKERS,
} from '@fixtures/private/delivery/delivery-map/delivery-map.fixtures.spec';
import {
  MOCK_CARRIER_OFFICE_INFO,
  MOCK_CARRIER_OFFICE_INFO_2,
  MOCK_CARRIER_OFFICE_INFO_SCHEDULE,
} from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { CarrierOfficeInfo, CarrierOfficeSchedule } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { Location } from '@api/core/model';

describe('DeliveryMapService', () => {
  let service: DeliveryMapService;
  let userService: UserService;
  let carrierOfficesApiService: CarrierOfficesApiService;
  let geoLocationService: GeolocationService;
  let carrierOfficeAddressesApiService: CarrierOfficeAddressesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CarrierOfficesApiService,
          useValue: {
            getCarrierOfficeAddresses() {
              return of();
            },
          },
        },
        {
          provide: CarrierOfficeAddressesApiService,
          useValue: {
            createSelectedCarrierOffice() {
              return of();
            },
            updateSelectedCarrierOffice() {
              return of();
            },
          },
        },
        {
          provide: GeolocationService,
          useClass: MockGeolocationService,
        },
        {
          provide: UserService,
          useValue: {
            get() {
              return of(MOCK_OTHER_USER);
            },
            getLoggedUserInformation() {
              return of(MOCK_USER);
            },
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryMapService);
    userService = TestBed.inject(UserService);
    carrierOfficesApiService = TestBed.inject(CarrierOfficesApiService);
    carrierOfficeAddressesApiService = TestBed.inject(CarrierOfficeAddressesApiService);
    geoLocationService = TestBed.inject(GeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we get the initial offices', () => {
    describe('and the user has full address', () => {
      let expectedCarrierOffices: CarrierOfficeInfo[];
      let expectedLocations: Location[];
      let result: CarrierOfficeInfo[];

      beforeEach(() => {
        spyOn(geoLocationService, 'geocode').and.returnValue(of(MOCK_LOCATION));
        spyOn(userService, 'getLoggedUserInformation');
        spyOn(carrierOfficesApiService, 'getCarrierOfficeAddresses').and.returnValue(of([MOCK_CARRIER_OFFICE_INFO]));

        service.carrierOffices$.subscribe((offices: CarrierOfficeInfo[]) => (expectedCarrierOffices = offices));
        service.officeMarkers$.subscribe((locations: Location[]) => (expectedLocations = locations));
        service
          .initializeOffices$(MOCK_FULL_ADDRESS, POST_OFFICE_CARRIER.CORREOS)
          .subscribe((offices: CarrierOfficeInfo[]) => (result = offices));
      });

      it('should request the offices with the full address location', () => {
        expect(geoLocationService.geocode).toHaveBeenCalledTimes(1);
        expect(userService.getLoggedUserInformation).not.toHaveBeenCalled();
        expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledTimes(1);
        expect(geoLocationService.geocode).toHaveBeenCalledWith(MOCK_FULL_ADDRESS);
        expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledWith(
          MOCK_LOCATION_WITH_RADIUS,
          POST_OFFICE_CARRIER.CORREOS
        );
      });

      it('should return the carriers info', () => {
        expect(result).toStrictEqual([MOCK_CARRIER_OFFICE_INFO]);
      });

      it('should initialize the carrier offices', () => {
        expect(expectedCarrierOffices).toStrictEqual([MOCK_CARRIER_OFFICE_INFO]);
      });

      describe('and we get the office markers', () => {
        it('should return the office marker locations', () => {
          expect(expectedLocations).toStrictEqual(MOCK_OFFICE_MARKERS);
        });
      });
    });

    describe(`and the user doesn't have full address`, () => {
      describe('and the user has location defined', () => {
        let expectedCarrierOffices: CarrierOfficeInfo[];
        let result: CarrierOfficeInfo[];

        beforeEach(() => {
          spyOn(userService, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER));
          spyOn(geoLocationService, 'geocode');
          spyOn(carrierOfficesApiService, 'getCarrierOfficeAddresses').and.returnValue(of([MOCK_CARRIER_OFFICE_INFO_2]));

          service.carrierOffices$.subscribe((offices: CarrierOfficeInfo[]) => (expectedCarrierOffices = offices));
          service.initializeOffices$(null, POST_OFFICE_CARRIER.SEUR).subscribe((offices: CarrierOfficeInfo[]) => (result = offices));
        });

        it('should request the offices with the user location', () => {
          expect(geoLocationService.geocode).not.toHaveBeenCalled();
          expect(userService.getLoggedUserInformation).toHaveBeenCalledTimes(1);
          expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledTimes(1);
          expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledWith(
            MOCK_USER_LOCATION_WITH_RADIUS,
            POST_OFFICE_CARRIER.SEUR
          );
        });

        it('should return the carriers info', () => {
          expect(result).toStrictEqual([MOCK_CARRIER_OFFICE_INFO_2]);
        });

        it('should initialize the carrier offices', () => {
          expect(expectedCarrierOffices).toStrictEqual([MOCK_CARRIER_OFFICE_INFO_2]);
        });
      });

      describe(`and the user doesn't have location defined`, () => {
        let expectedCarrierOffices: CarrierOfficeInfo[];
        let result: CarrierOfficeInfo[];

        beforeEach(() => {
          spyOn(userService, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER_WITHOUT_LOCATION));
          spyOn(geoLocationService, 'geocode');
          spyOn(carrierOfficesApiService, 'getCarrierOfficeAddresses').and.returnValue(
            of([MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2])
          );

          service.carrierOffices$.subscribe((offices: CarrierOfficeInfo[]) => (expectedCarrierOffices = offices));
          service
            .initializeOffices$(null, POST_OFFICE_CARRIER.POSTE_ITALIANE)
            .subscribe((offices: CarrierOfficeInfo[]) => (result = offices));
        });

        it('should request the offices with the fallback location', () => {
          expect(geoLocationService.geocode).not.toHaveBeenCalled();
          expect(userService.getLoggedUserInformation).toHaveBeenCalledTimes(1);
          expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledTimes(1);
          expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledWith(
            MOCK_FALLBACK_LOCATION_WITH_RADIUS,
            POST_OFFICE_CARRIER.POSTE_ITALIANE
          );
        });

        it('should return the carriers info', () => {
          expect(result).toStrictEqual([MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2]);
        });

        it('should initialize the carrier offices', () => {
          expect(expectedCarrierOffices).toStrictEqual([MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2]);
        });
      });
    });
  });

  describe('and we request offices with specific location and carrier', () => {
    let expectedCarrierOffices: CarrierOfficeInfo[];
    let result: CarrierOfficeInfo[];

    beforeEach(() => {
      spyOn(carrierOfficesApiService, 'getCarrierOfficeAddresses').and.returnValue(
        of([MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2])
      );

      service.carrierOffices$.subscribe((offices: CarrierOfficeInfo[]) => (expectedCarrierOffices = offices));
      service
        .requestOffices$(MOCK_LOCATION_WITH_RADIUS, POST_OFFICE_CARRIER.POSTE_ITALIANE)
        .subscribe((offices: CarrierOfficeInfo[]) => (result = offices));
    });

    it('should get the carrier office addresses', () => {
      expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledTimes(1);
      expect(carrierOfficesApiService.getCarrierOfficeAddresses).toHaveBeenCalledWith(
        MOCK_LOCATION_WITH_RADIUS,
        POST_OFFICE_CARRIER.POSTE_ITALIANE
      );
    });

    it('should update the carrier offices value', () => {
      expect(expectedCarrierOffices).toStrictEqual([MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2]);
    });

    describe('and we click in a office', () => {
      let expectedSelectedOfficeInformation: CarrierOfficeSchedule;

      beforeEach(() => {
        service.selectedOfficeInformation$.subscribe(
          (officeInformation: CarrierOfficeSchedule) => (expectedSelectedOfficeInformation = officeInformation)
        );
        service.markOffice(MOCK_CARRIER_OFFICE_INFO_LOCATION);
      });

      it('should mark as selected the provided location office', () => {
        expect(expectedSelectedOfficeInformation).toStrictEqual(MOCK_CARRIER_OFFICE_INFO_SCHEDULE);
      });

      describe('and we select the office preference', () => {
        beforeEach(() => {
          spyOn(carrierOfficeAddressesApiService, 'updateSelectedCarrierOffice').and.returnValue(of(null));
          spyOn(carrierOfficeAddressesApiService, 'createSelectedCarrierOffice').and.returnValue(of(null));
        });

        describe('and the user already has an office preference', () => {
          const MOCK_USER_OFFICE_ID: string = '2832udn83923';

          beforeEach(() => {
            service.selectOfficePreference$(MOCK_USER_OFFICE_ID).subscribe();
          });

          it('should NOT create the selected carrier office', () => {
            expect(carrierOfficeAddressesApiService.createSelectedCarrierOffice).not.toHaveBeenCalled();
          });

          it('should update the selected carrier office', () => {
            expect(carrierOfficeAddressesApiService.updateSelectedCarrierOffice).toHaveBeenCalledTimes(1);
            expect(carrierOfficeAddressesApiService.updateSelectedCarrierOffice).toHaveBeenCalledWith(
              MOCK_USER_OFFICE_ID,
              MOCK_CARRIER_OFFICE_INFO
            );
          });
        });

        describe(`and the user don't have an office preference`, () => {
          beforeEach(() => {
            service.selectOfficePreference$(null).subscribe();
          });

          it('should NOT update the selected carrier office', () => {
            expect(carrierOfficeAddressesApiService.updateSelectedCarrierOffice).not.toHaveBeenCalled();
          });

          it('should create the selected carrier office', () => {
            expect(carrierOfficeAddressesApiService.createSelectedCarrierOffice).toHaveBeenCalledTimes(1);
            expect(carrierOfficeAddressesApiService.createSelectedCarrierOffice).toHaveBeenCalledWith(MOCK_CARRIER_OFFICE_INFO);
          });
        });
      });
    });
  });

  describe('and we get the initial center location', () => {
    describe('and the user has the default address defined', () => {
      let expectedLocation: Location;

      beforeEach(() => {
        spyOn(geoLocationService, 'geocode').and.returnValue(of(MOCK_LOCATION));
        spyOn(userService, 'getLoggedUserInformation');

        service.initialCenterLocation$(MOCK_FULL_ADDRESS).subscribe((location: Location) => (expectedLocation = location));
      });

      it('should request the location with the default address', () => {
        expect(userService.getLoggedUserInformation).not.toHaveBeenCalled();
        expect(geoLocationService.geocode).toHaveBeenCalledTimes(1);
        expect(geoLocationService.geocode).toHaveBeenCalledWith(MOCK_FULL_ADDRESS);
      });

      it('should return the default address location', () => {
        expect(expectedLocation).toStrictEqual(MOCK_LOCATION);
      });
    });

    describe(`and the user don't have defined the default address`, () => {
      beforeEach(() => {
        spyOn(geoLocationService, 'geocode');
      });

      describe(`and the user has the user location defined`, () => {
        let expectedLocation: Location;

        beforeEach(() => {
          spyOn(userService, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER));

          service.initialCenterLocation$(null).subscribe((location: Location) => (expectedLocation = location));
        });

        it('should request the location with the user location', () => {
          expect(userService.getLoggedUserInformation).toHaveBeenCalledTimes(1);
          expect(geoLocationService.geocode).not.toHaveBeenCalled();
        });

        it('should return the user location', () => {
          expect(expectedLocation).toStrictEqual(MOCK_USER_LOCATION);
        });
      });

      describe(`and the user don't have defined the user location`, () => {
        let expectedLocation: Location;

        beforeEach(() => {
          spyOn(userService, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER_WITHOUT_LOCATION));

          service.initialCenterLocation$(null).subscribe((location: Location) => (expectedLocation = location));
        });

        it('should return the fallback location', () => {
          expect(expectedLocation).toStrictEqual(MOCK_FALLBACK_LOCATION);
        });
      });
    });
  });

  describe('and we reset the selected office', () => {
    let selectedOfficeInfo: CarrierOfficeSchedule;

    beforeEach(() => {
      service.selectedOfficeInformation$.subscribe((info: CarrierOfficeSchedule) => (selectedOfficeInfo = info));
      service.resetSelectedOffice();
    });

    it('should clean the selected office', () => {
      expect(selectedOfficeInfo).toBeNull();
    });
  });
});
