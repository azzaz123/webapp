import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

import { AcceptScreenStoreService } from './accept-screen-store.service';

describe('AcceptScreenStoreService', () => {
  const MOCK_REQUEST_ID: string = '2387283dsbd';
  const acceptScreenServiceSubjectMock: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(MOCK_ACCEPT_SCREEN_PROPERTIES);

  let service: AcceptScreenStoreService;
  let acceptScreenService: AcceptScreenService;
  let expectedAcceptScreenProperties: AcceptScreenProperties;
  let expectedDropOffMode: CARRIER_DROP_OFF_MODE;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcceptScreenStoreService,
        {
          provide: AcceptScreenService,
          useValue: {
            getAcceptScreenProperties(): Observable<AcceptScreenProperties> {
              return of(acceptScreenServiceSubjectMock.value);
            },
            acceptRequestPostOfficeDropOff() {
              return of({});
            },
            acceptRequestHomePickup() {
              return of({});
            },
            rejectRequest() {
              return of({});
            },
          },
        },
      ],
    });
    service = TestBed.inject(AcceptScreenStoreService);
    acceptScreenService = TestBed.inject(AcceptScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we initialize the accept screen store', () => {
    beforeEach(fakeAsync(() => {
      spyOn(acceptScreenService, 'getAcceptScreenProperties').and.callThrough();
      service.properties$.subscribe((newProperties: AcceptScreenProperties) => {
        expectedAcceptScreenProperties = newProperties;
      });

      service.initialize(MOCK_REQUEST_ID);
      tick();
    }));

    it('should request the accept screen properties', () => {
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledTimes(1);
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should update the accept screen store properties ', () => {
      expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
    });

    describe('and when we notify selected drop off mode by user changed', () => {
      const carrierPositionUpdatedByUser: number = 1;

      beforeEach(fakeAsync(() => {
        service.carrierSelectedIndex$.subscribe((newCarrierSelected: CARRIER_DROP_OFF_MODE) => {
          expectedDropOffMode = newCarrierSelected;
        });

        service.selectNewDropOffMode(carrierPositionUpdatedByUser);
        tick();
      }));

      it('should update the selected drop off mode by user', () => {
        const selectedCarrierMode: CARRIER_DROP_OFF_MODE = expectedAcceptScreenProperties.carriers[carrierPositionUpdatedByUser].type;

        expect(expectedDropOffMode).toStrictEqual(selectedCarrierMode);
      });

      it('should update the carrier selecter property', () => {
        expectedAcceptScreenProperties.carriers.forEach((carrier: AcceptScreenCarrier, i: number) => {
          const isSelected: boolean = i === carrierPositionUpdatedByUser;
          expect(carrier.isSelected).toStrictEqual(isSelected);
        });
      });

      it('should update the accept screen properties', () => {
        expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU);
      });
    });

    describe('and when we update the accept screen store', () => {
      beforeEach(fakeAsync(() => {
        acceptScreenServiceSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS);

        service.update(MOCK_REQUEST_ID);
        tick();
      }));

      it('should update the accept screen store properties ', () => {
        expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS);
      });
    });

    describe('and the user accepts a request', () => {
      describe('and the selected drop off mode is POST OFFICE', () => {
        beforeEach(() => {
          spyOn(acceptScreenService, 'acceptRequestPostOfficeDropOff').and.callThrough();

          service.selectNewDropOffMode(CARRIER_DROP_OFF_MODE.POST_OFFICE);
          service.acceptRequest(MOCK_REQUEST_ID).subscribe();
        });

        it('should call to accept the request with post office drop off mode', () => {
          expect(acceptScreenService.acceptRequestPostOfficeDropOff).toHaveBeenCalledTimes(1);
          expect(acceptScreenService.acceptRequestPostOfficeDropOff).toHaveBeenCalledWith(MOCK_REQUEST_ID);
        });
      });

      describe('and the selected drop off mode is HOME PICK UP', () => {
        beforeEach(() => {
          spyOn(acceptScreenService, 'acceptRequestHomePickup').and.callThrough();

          service.selectNewDropOffMode(CARRIER_DROP_OFF_MODE.HOME_PICK_UP);
          service.acceptRequest(MOCK_REQUEST_ID);
        });

        it('should call to accept the request with home pick up', () => {
          expect(acceptScreenService.acceptRequestHomePickup).toHaveBeenCalledTimes(1);
          expect(acceptScreenService.acceptRequestHomePickup).toHaveBeenCalledWith(MOCK_REQUEST_ID);
        });
      });
    });

    describe('and the user rejects a request', () => {
      beforeEach(() => {
        spyOn(acceptScreenService, 'rejectRequest').and.callThrough();

        service.rejectRequest(MOCK_REQUEST_ID);
      });

      it('should call to accept the request with post office drop off mode', () => {
        expect(acceptScreenService.rejectRequest).toHaveBeenCalledTimes(1);
        expect(acceptScreenService.rejectRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      });
    });
  });
});
