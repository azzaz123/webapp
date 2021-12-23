import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of, throwError } from 'rxjs';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';
import { TransactionTrackingScreenStoreService } from '../../../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TransactionTrackingScreenTrackingEventsService } from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';

describe('TransactionTrackingActionUserActionComponent', () => {
  let component: TransactionTrackingActionUserActionComponent;
  let fixture: ComponentFixture<TransactionTrackingActionUserActionComponent>;
  let transactionTrackingService: TransactionTrackingService;
  let errorsService: ErrorsService;
  let transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService;
  let storeService: TransactionTrackingScreenStoreService;
  let router: Router;

  const MOCK_REQUEST_ID = '124565656';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingActionUserActionComponent],
      providers: [
        {
          provide: TransactionTrackingService,
          useValue: {
            sendUserAction() {
              return of();
            },
          },
        },
        {
          provide: ErrorsService,
          useClass: MockErrorService,
        },
        {
          provide: TransactionTrackingScreenTrackingEventsService,
          useValue: {
            trackClickActionTTS() {},
          },
        },
        TransactionTrackingScreenStoreService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => MOCK_REQUEST_ID,
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            get url() {
              return '/path';
            },
            navigate() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionUserActionComponent);
    component = fixture.componentInstance;
    component.userAction = MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION;
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    transactionTrackingScreenTrackingEventsService = TestBed.inject(TransactionTrackingScreenTrackingEventsService);
    errorsService = TestBed.inject(ErrorsService);
    storeService = TestBed.inject(TransactionTrackingScreenStoreService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user clicks on action', () => {
    beforeEach(() => {
      spyOn(storeService, 'refresh');
      spyOn(router, 'navigate');
    });

    describe('and the action has analytics...', () => {
      it('should track the event', () => {
        spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        component.userAction = MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION;

        fixture.debugElement.query(By.css('div')).nativeElement.click();
        fixture.detectChanges();

        expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
      });
    });

    describe('and the action has NOT analytics...', () => {
      it('should NOT track the event', () => {
        spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        component.userAction = MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS;

        fixture.debugElement.query(By.css('div')).nativeElement.click();
        fixture.detectChanges();

        expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
        expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
          MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS.analytics.requestId,
          MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS.analytics.source
        );
      });
    });

    describe('and the request fails...', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(throwError('error! :P'));

        fixture.debugElement.query(By.css('div')).nativeElement.click();
        fixture.detectChanges();
      });

      it('should send the request user action petition', () => {
        expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
        expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(
          MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.transactionId,
          MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.name
        );
      });

      it('should show an error', () => {
        expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      });

      it('should NOT refresh the transaction tracking store', () => {
        expect(storeService.refresh).not.toHaveBeenCalled();
      });

      it('should stay at the same page', () => {
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('and the request succeed...', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(of(''));
      });

      describe('and we are on the TTS instructions page', () => {
        beforeEach(() => {
          jest
            .spyOn(router, 'url', 'get')
            .mockReturnValue(`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/1234/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}`);

          fixture.debugElement.query(By.css('div')).nativeElement.click();
        });

        it('should send the request user action petition', () => {
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(
            MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.transactionId,
            MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.name
          );
        });

        it('should NOT show an error', () => {
          expect(errorsService.i18nError).not.toHaveBeenCalled();
        });

        it('should update the transaction tracking store', () => {
          expect(storeService.refresh).toHaveBeenCalledTimes(1);
        });

        it('should redirect to the TTS page', () => {
          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_REQUEST_ID}`]);
        });
      });

      describe('and we are NOT on the TTS instructions page', () => {
        beforeEach(() => {
          jest.spyOn(router, 'url', 'get').mockReturnValue(`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/1234`);

          fixture.debugElement.query(By.css('div')).nativeElement.click();
        });

        it('should send the request user action petition', () => {
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(
            MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.transactionId,
            MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION.name
          );
        });

        it('should NOT show an error', () => {
          expect(errorsService.i18nError).not.toHaveBeenCalled();
        });

        it('should stay at the same page', () => {
          expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should update the transaction tracking store', () => {
          expect(storeService.refresh).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
