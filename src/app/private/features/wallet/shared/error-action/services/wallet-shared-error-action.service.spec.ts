import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { WalletSharedErrorActionService } from './../services/wallet-shared-error-action.service';

import { Observable } from 'rxjs';

describe('GIVEN the WalletSharedErrorActionService', () => {
  describe('WHEN displaying the error action service', () => {
    let service: WalletSharedErrorActionService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [],
          providers: [WalletSharedErrorActionService],
        });
        service = TestBed.inject(WalletSharedErrorActionService);
      })
    );
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
    it('should have a listener to watch errors', () => {
      const target = service.errorObserver;

      expect(target).toBeInstanceOf(Observable);
    });
    it('should send the received data', fakeAsync(() => {
      // Arrange
      const expected = new HttpErrorResponse({
        error: 'any error',
        headers: new HttpHeaders('some headers'),
        status: 400,
        statusText: 'No found',
        url: 'some url',
      });
      const observer = service.errorObserver.subscribe((result: unknown) => {
        observer.unsubscribe();
        // Assert
        expect(result).toEqual(expected);
      });

      // Act
      service.show(expected);
      tick();
    }));
    describe('WHEN the error is a not found error', () => {
      it('should not send the received data', fakeAsync(() => {
        let received = null;
        const expected = new HttpErrorResponse({
          error: 'any error',
          headers: new HttpHeaders('some headers'),
          status: 404,
          statusText: 'No found',
          url: 'some url',
        });
        const observer = service.errorObserver.subscribe((result: unknown) => {
          observer.unsubscribe();
          received = result;
        });

        service.show(expected);
        tick();

        expect(received).toBe(null);
        observer.unsubscribe();
      }));
    });
  });
});
