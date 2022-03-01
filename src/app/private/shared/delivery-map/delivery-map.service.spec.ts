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
        CarrierOfficesApiService,
        CarrierOfficeAddressesApiService,
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
});
