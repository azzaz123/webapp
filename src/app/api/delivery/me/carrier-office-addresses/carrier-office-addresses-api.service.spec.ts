import { TestBed } from '@angular/core/testing';
import {
  MOCK_SELECTED_CARRIER_OFFICE_DTO,
  MOCK_SELECTED_CARRIER_OFFICE_DTO_2,
} from '@api/fixtures/delivery/carrier-office-addresses/selected-carrier-office-dto.fixtures.spec';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_CARRIER_OFFICE_INFO,
  MOCK_CARRIER_OFFICE_INFO_2,
} from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { of } from 'rxjs';

import { CarrierOfficeAddressesApiService } from './carrier-office-addresses-api.service';
import { CarrierOfficeAddressesHttpService } from './http/carrier-office-addresses-http.service';

describe('CarrierOfficeAddressesApiService', () => {
  const MOCK_UUID: string = '8wbdusdnws';
  let service: CarrierOfficeAddressesApiService;
  let carrierOfficeAddressesHttpService: CarrierOfficeAddressesHttpService;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return MOCK_UUID;
            },
          },
        },
        {
          provide: CarrierOfficeAddressesHttpService,
          useValue: {
            createSelectedCarrierOffice() {
              return of({});
            },

            updateSelectedCarrierOffice() {
              return of({});
            },
          },
        },
      ],
    });
    service = TestBed.inject(CarrierOfficeAddressesApiService);
    carrierOfficeAddressesHttpService = TestBed.inject(CarrierOfficeAddressesHttpService);
    uuidService = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to create a selected carrier office', () => {
    beforeEach(() => {
      spyOn(carrierOfficeAddressesHttpService, 'createSelectedCarrierOffice').and.callThrough();
      spyOn(uuidService, 'getUUID').and.callThrough();

      service.createSelectedCarrierOffice(MOCK_CARRIER_OFFICE_INFO).subscribe();
    });

    it('should generate new uuid for the carrier', () => {
      expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
    });

    it('should ask to the http service with the office mapped', () => {
      expect(carrierOfficeAddressesHttpService.createSelectedCarrierOffice).toHaveBeenCalledTimes(1);
      expect(carrierOfficeAddressesHttpService.createSelectedCarrierOffice).toHaveBeenCalledWith(MOCK_SELECTED_CARRIER_OFFICE_DTO);
    });
  });

  describe('when asking to update a selected carrier office', () => {
    const MOCK_SELECTED_CARRIER_OFFICE_ID = '2837sdbs';
    beforeEach(() => {
      spyOn(carrierOfficeAddressesHttpService, 'updateSelectedCarrierOffice').and.callThrough();
      spyOn(uuidService, 'getUUID').and.callThrough();

      service.updateSelectedCarrierOffice(MOCK_SELECTED_CARRIER_OFFICE_ID, MOCK_CARRIER_OFFICE_INFO_2).subscribe();
    });

    it('should NOT generate new uuid for the carrier', () => {
      expect(uuidService.getUUID).not.toHaveBeenCalled();
    });

    it('should ask to the http service with the office mapped', () => {
      expect(carrierOfficeAddressesHttpService.updateSelectedCarrierOffice).toHaveBeenCalledTimes(1);
      expect(carrierOfficeAddressesHttpService.updateSelectedCarrierOffice).toHaveBeenCalledWith(
        MOCK_SELECTED_CARRIER_OFFICE_ID,
        MOCK_SELECTED_CARRIER_OFFICE_DTO_2
      );
    });
  });
});
