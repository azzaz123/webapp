import { TestBed } from '@angular/core/testing';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { MOCK_CARRIER_OFFICES_ADDRESSES_DTO } from '@api/fixtures/delivery/carrier-offices/carrier-offices-dto.fixtures.spec';
import { MOCK_CARRIERS_OFFICE_INFO } from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { of } from 'rxjs';

import { CarrierOfficesApiService } from './carrier-offices-api.service';
import { CarrierOfficesHttpService } from './http/carrier-offices-http.service';
import { mapCarrierDomainToDto } from './mappers/requests/carrier-offices.mapper';

describe('CarrierOfficesApiService', () => {
  let service: CarrierOfficesApiService;
  let carrierOfficesHttpService: CarrierOfficesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CarrierOfficesHttpService,
          useValue: {
            getCarrierOfficeAddresses() {
              return of(MOCK_CARRIER_OFFICES_ADDRESSES_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(CarrierOfficesApiService);
    carrierOfficesHttpService = TestBed.inject(CarrierOfficesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for carrier office addresses', () => {
    let result: CarrierOfficeInfo[];
    const MOCK_LATITUDE: number = 3435.1;
    const MOCK_LONGITUDE: number = 938293.3;
    const MOCK_RADIUS_KM: number = 2;
    const MOCK_CARRIER: POST_OFFICE_CARRIER = POST_OFFICE_CARRIER.CORREOS;

    beforeEach(() => {
      spyOn(carrierOfficesHttpService, 'getCarrierOfficeAddresses').and.callThrough();

      service.getCarrierOfficeAddresses(MOCK_LATITUDE, MOCK_LONGITUDE, MOCK_RADIUS_KM, MOCK_CARRIER).subscribe((res) => (result = res));
    });

    it('should ask server for offices', () => {
      expect(carrierOfficesHttpService.getCarrierOfficeAddresses).toHaveBeenCalledTimes(1);
      expect(carrierOfficesHttpService.getCarrierOfficeAddresses).toHaveBeenCalledWith(
        MOCK_LATITUDE,
        MOCK_LONGITUDE,
        MOCK_RADIUS_KM,
        mapCarrierDomainToDto[MOCK_CARRIER]
      );
    });

    it('should return the offices mapped', () => {
      expect(result).toStrictEqual(MOCK_CARRIERS_OFFICE_INFO);
    });
  });
});
