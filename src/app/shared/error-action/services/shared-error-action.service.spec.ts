import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { SharedErrorActionService } from '@shared/error-action/services/shared-error-action.service';

import { Observable } from 'rxjs';

describe('GIVEN the SharedErrorActionService', () => {
  describe('WHEN displaying the error action service', () => {
    let service: SharedErrorActionService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [],
          providers: [SharedErrorActionService],
        });
        service = TestBed.inject(SharedErrorActionService);
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
      const expected = new HttpErrorResponse({
        error: 'any error',
        headers: new HttpHeaders('some headers'),
        status: 400,
        statusText: 'No found',
        url: 'some url',
      });

      const observer = service.errorObserver.subscribe((result: unknown) => {
        observer.unsubscribe();
        expect(result).toEqual(expected);
      });

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
