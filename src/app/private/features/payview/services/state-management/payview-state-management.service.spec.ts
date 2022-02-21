import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

describe('PayviewStateManagementService', () => {
  let service: PayviewStateManagementService;
  let payviewService: PayviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayviewStateManagementService,
        {
          provide: PayviewService,
          useValue: {
            getCurrentState(value: string): Observable<PayviewState> {
              return of(MOCK_PAYVIEW_STATE);
            },
          },
        },
      ],
    });
    payviewService = TestBed.inject(PayviewService);
    service = TestBed.inject(PayviewStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN the item is reported', () => {
    const fakeItemHash: string = 'this_is_a_fake_item_hash';
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.returnValue(of(MOCK_PAYVIEW_STATE).pipe(delay(0)));
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = fakeItemHash;
      tick(0);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
      expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash);
    }));

    it('should update the payview state ', fakeAsync(() => {
      expect(payviewState).toStrictEqual(MOCK_PAYVIEW_STATE);
    }));

    it('should update the item hash ', fakeAsync(() => {
      expect(itemHash).toBe(fakeItemHash);
    }));
  });

  describe('WHEN the item is not reported', () => {
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.callThrough();
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = null;
      tick();
    }));

    it('should not request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).not.toHaveBeenCalled;
    }));

    it('should not update the payview state ', fakeAsync(() => {
      expect(payviewState).toBeFalsy();
    }));

    it('should update the item hash', fakeAsync(() => {
      expect(itemHash).toBeFalsy();
    }));
  });

  describe('WHEN there is an error in any service', () => {
    const fakeItemHash: string = 'this_is_a_fake_item_hash';
    let itemHash: string;
    let payviewState: PayviewState;

    beforeEach(fakeAsync(() => {
      spyOn(payviewService, 'getCurrentState').and.returnValue(
        of(MOCK_PAYVIEW_STATE).pipe(
          delay(0),
          mergeMap((e) => throwError('The server is broken'))
        )
      );
      service.payViewState$.subscribe((result: PayviewState) => {
        payviewState = result;
      });
      service.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      service.itemHash = fakeItemHash;
      tick(0);
    }));

    it('should request the payview state', fakeAsync(() => {
      expect(payviewService.getCurrentState).toHaveBeenCalledTimes(1);
      expect(payviewService.getCurrentState).toHaveBeenCalledWith(fakeItemHash);
    }));

    it('should not update the payview state ', fakeAsync(() => {
      expect(payviewState).toBeFalsy();
    }));

    it('should update the item hash', fakeAsync(() => {
      expect(itemHash).toBeTruthy();
    }));
  });
});
