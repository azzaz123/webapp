import { TestBed } from '@angular/core/testing';

import { DeliveryMapService } from './delivery-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@core/user/user.service';
import { MOCK_OTHER_USER, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { CarrierOfficesApiService } from '@api/bff/delivery/carrier-offices/carrier-offices-api.service';
import { of } from 'rxjs';
import { CarrierOfficeAddressesApiService } from '@api/delivery/me/carrier-office-addresses/carrier-office-addresses-api.service';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { MockGeolocationService } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';

describe('DeliveryMapService', () => {
  let service: DeliveryMapService;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we get the initial offices', () => {
    describe('and the user has full address', () => {
      it('should request the offices with the full address location', () => {});
    });

    describe(`and the user doesn't have full address`, () => {
      describe('and the user has location defined', () => {
        it('should request the offices with the user location', () => {});
      });

      describe(`and the user doesn't have location defined`, () => {
        it('should request the offices with the user location', () => {});
      });
    });
  });

  describe('and we request offices with specific location and carrier', () => {
    it('should get the carrier office addresses', () => {});

    it('should update the carrier offices value', () => {});
  });

  describe('and we select the office preference', () => {
    describe('and the user already has an office preference', () => {
      it('should update the selected carrier office', () => {});
    });

    describe(`and the user don't have an office preference`, () => {
      it('should create the selected carrier office', () => {});
    });
  });

  describe('and we get the initial center location', () => {
    describe('and the user has the default address defined', () => {
      it('should return the default address location', () => {});
    });

    describe(`and the user don't have defined the default address`, () => {
      describe(`and the user has the user location defined`, () => {
        it('should return the user location', () => {});
      });

      describe(`and the user don't have defined the user location`, () => {
        it('should return the fallback location', () => {});
      });
    });
  });

  describe('and we click in a office', () => {
    it('should mark as selected the provided location office', () => {});
  });

  describe('and we reset the selected office', () => {
    it('should clean the selected office', () => {});
  });

  describe('and we get the office markers', () => {
    it('should return the office marker locations', () => {});
  });

  describe('and we get the office carriers', () => {
    it('should return the office specifications', () => {});
  });

  describe('and we get the selected office information.Función', () => {
    it('should return the office schedule', () => {});
  });
});
