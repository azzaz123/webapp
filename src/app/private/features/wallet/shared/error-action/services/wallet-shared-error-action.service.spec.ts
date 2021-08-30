import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { WalletSharedErrorActionEnum } from './../enums/wallet-shared-error-action.enum';
import { WalletSharedErrorActionInterface } from './../interfaces/wallet-shared-error-action.interface';
import { WalletSharedErrorActionService } from './../services/wallet-shared-error-action.service';

import { Observable } from 'rxjs';
import { WalletSharedErrorActionKeyEnum } from '../enums/wallet-shared-error-action-key.enum';

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
    it('should be configured with the default configuration', fakeAsync(() => {
      // Arrange
      const expected = {
        data: 'some data',
        key: 'wallet',
      };

      const observer = service.errorObserver.subscribe((result: WalletSharedErrorActionInterface) => {
        observer.unsubscribe();
        // Assert
        expect(result.data).toEqual(expected.data);
        expect(result.key).toEqual(expected.key);
      });

      // Act
      service.show(WalletSharedErrorActionKeyEnum.wallet, 'some data');
      tick();
    }));
    it('should be send the received data', fakeAsync(() => {
      // Arrange
      const expected = new HttpErrorResponse({
        error: 'any error',
        headers: new HttpHeaders('some headers'),
        status: 400,
        statusText: 'No found',
        url: 'some url',
      });
      const observer = service.errorObserver.subscribe((result: WalletSharedErrorActionInterface) => {
        observer.unsubscribe();
        // Assert
        expect(result.data).toEqual(expected);
      });

      // Act
      service.show(null, expected);
      tick();
    }));
  });
});
