import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_DETAILS,
  MOCK_TRANSACTION_TRACKING_DETAILS_WITH_PAYPAL,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE } from '@api/fixtures/bff/delivery';
import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_INSTRUCTIONS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-instructions.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-instructions-dto.fixtures.spec';
import {
  TransactionTracking,
  TransactionTrackingDetails,
  TransactionTrackingInstructions,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailPayloadUserActionNameDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import {
  TransactionTrackingService,
  TransactionTrackingUserAction,
} from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { of } from 'rxjs';
import { MOCK_UUID } from '@fixtures/core/uuid/uuid.fixtures.spec';

describe('TransactionTrackingService', () => {
  let service: TransactionTrackingService;
  let transactionTrackingHttpService: TransactionTrackingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionTrackingService,
        {
          provide: TransactionTrackingHttpService,
          useValue: {
            get() {
              return of(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);
            },
            getDetails() {
              return of(MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE);
            },
            getInstructions() {
              return of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE);
            },
            sendCancelTransaction() {
              return of();
            },
            sendExpireClaimPeriod() {
              return of();
            },
            sendPackageArrived() {
              return of();
            },
          },
        },
      ],
    });
    service = TestBed.inject(TransactionTrackingService);
    transactionTrackingHttpService = TestBed.inject(TransactionTrackingHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN they ask for the transaction tracking info', () => {
    const requestId = 'This is my request Id';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, 'get').and.callThrough();
    });

    it('should call to get the information', () => {
      service.get(requestId).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to get the information with the request id', () => {
      service.get(requestId).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId);
    });

    it('should return the transation tracking', fakeAsync(() => {
      const expected = MOCK_TRANSACTION_TRACKING;
      let response: TransactionTracking;

      service.get(requestId).subscribe((data) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });

  describe('WHEN they ask for the transaction tracking details info', () => {
    const requestId = 'This is my request Id';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, 'getDetails').and.callThrough();
    });

    it('should call to get the information', () => {
      service.getDetails(requestId).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to get the information with the request id', () => {
      service.getDetails(requestId).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId);
    });

    it('should return the transation tracking details', fakeAsync(() => {
      const expected = MOCK_TRANSACTION_TRACKING_DETAILS;
      let response: TransactionTrackingDetails;

      service.getDetails(requestId).subscribe((data) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });

  describe('when checking if a request was done with PayPal', () => {
    describe('and when request payment method was PayPal', () => {
      let result: boolean;

      beforeEach(fakeAsync(() => {
        spyOn(service, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS_WITH_PAYPAL));

        service.requestWasDoneWithPayPal(MOCK_UUID).subscribe((data) => (result = data));
        tick();
      }));

      it('should notify that was with PayPal', () => {
        expect(result).toBe(true);
      });
    });

    describe('and when request payment method was NOT PayPal', () => {
      let result: boolean;

      beforeEach(fakeAsync(() => {
        spyOn(service, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS));

        service.requestWasDoneWithPayPal(MOCK_UUID).subscribe((data) => (result = data));
        tick();
      }));

      it('should notify that it was NOT with PayPal', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('WHEN they ask for the transaction tracking instructions info', () => {
    const requestId = 'This is my request Id';
    const type = 'dialog';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, 'getInstructions').and.callThrough();
    });

    it('should call to get the information', () => {
      service.getInstructions(requestId, type).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to get the information with the request id', () => {
      service.getInstructions(requestId, type).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId, type);
    });

    it('should return the transation tracking instructions', fakeAsync(() => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS;
      let response: TransactionTrackingInstructions;

      service.getInstructions(requestId, type).subscribe((data) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });

  describe.each([['sendCancelTransaction', 'CANCEL_TRANSACTION']])('WHEN they send an user action', (serverMethod, userAction) => {
    const requestId = 'This is my request Id';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, serverMethod as keyof TransactionTrackingHttpService).and.callThrough();
    });

    it('should call to cancel the transaction', () => {
      service.sendUserAction(requestId, userAction as TransactionTrackingActionDetailPayloadUserActionNameDto).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to cancel the transaction with the request id', () => {
      service.sendUserAction(requestId, userAction as TransactionTrackingActionDetailPayloadUserActionNameDto).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId);
    });
  });

  describe('when the action is not recognized', () => {
    beforeEach(fakeAsync(() => {
      spyOn(transactionTrackingHttpService, 'sendCancelTransaction');
      spyOn(transactionTrackingHttpService, 'sendExpireClaimPeriod');
      spyOn(transactionTrackingHttpService, 'sendPackageArrived');
      service.sendUserAction('1234', 'NOTKNOWN' as TransactionTrackingUserAction).subscribe();
      tick();
    }));

    it('should do nothing', () => {
      expect(transactionTrackingHttpService.sendCancelTransaction).not.toHaveBeenCalled();
      expect(transactionTrackingHttpService.sendExpireClaimPeriod).not.toHaveBeenCalled();
      expect(transactionTrackingHttpService.sendPackageArrived).not.toHaveBeenCalled();
    });
  });
});
