import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { Observable, of } from 'rxjs';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

import { AcceptScreenStoreService } from './accept-screen-store.service';

describe('AcceptScreenStoreService', () => {
  const MOCK_REQUEST_ID: string = '2387283dsbd';
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
              return of(MOCK_ACCEPT_SCREEN_PROPERTIES);
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

      service.initialize$(MOCK_REQUEST_ID).subscribe();
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
        service.selectedDropOffModeByUser$.subscribe((newModeSelectedByUser: CARRIER_DROP_OFF_MODE) => {
          expectedDropOffMode = newModeSelectedByUser;
        });

        service.notifySelectedDropOffModeByUser(carrierPositionUpdatedByUser);
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
  });

  describe('when we update the accept screen store', () => {
    let expectedAcceptScreenProperties: AcceptScreenProperties;

    beforeEach(fakeAsync(() => {
      spyOn(acceptScreenService, 'getAcceptScreenProperties').and.callThrough();
      service.properties$.subscribe((newProperties: AcceptScreenProperties) => {
        expectedAcceptScreenProperties = newProperties;
      });

      service.update(MOCK_REQUEST_ID);
      tick();
    }));

    it('should request the accept screen properties', () => {
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledTimes(1);
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should update the accept screen store properties ', () => {
      expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
    });
  });
});
