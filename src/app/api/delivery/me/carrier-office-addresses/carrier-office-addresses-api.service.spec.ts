import { TestBed } from '@angular/core/testing';
import { MOCK_SELECTED_CARRIER_OFFICE_DTO } from '@api/fixtures/delivery/carrier-office-addresses/selected-carrier-office-dto.fixtures.spec';
import { MOCK_SELECTED_CARRIER_OFFICE } from '@fixtures/private/delivery/selected-carrier-office/selected-carrier-office.fixtures.spec';
import { of } from 'rxjs';

import { CarrierOfficeAddressesApiService } from './carrier-office-addresses-api.service';
import { CarrierOfficeAddressesHttpService } from './http/carrier-office-addresses-http.service';

describe('CarrierOfficeAddressesApiService', () => {
  let service: CarrierOfficeAddressesApiService;
  let carrierOfficeAddressesHttpService: CarrierOfficeAddressesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to create a selected carrier office', () => {
    beforeEach(() => {
      spyOn(carrierOfficeAddressesHttpService, 'createSelectedCarrierOffice').and.callThrough();

      service.createSelectedCarrierOffice(MOCK_SELECTED_CARRIER_OFFICE).subscribe();
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

      service.updateSelectedCarrierOffice(MOCK_SELECTED_CARRIER_OFFICE_ID, MOCK_SELECTED_CARRIER_OFFICE).subscribe();
    });

    it('should ask to the http service with the office mapped', () => {
      expect(carrierOfficeAddressesHttpService.updateSelectedCarrierOffice).toHaveBeenCalledTimes(1);
      expect(carrierOfficeAddressesHttpService.updateSelectedCarrierOffice).toHaveBeenCalledWith(
        MOCK_SELECTED_CARRIER_OFFICE_ID,
        MOCK_SELECTED_CARRIER_OFFICE_DTO
      );
    });
  });
});
