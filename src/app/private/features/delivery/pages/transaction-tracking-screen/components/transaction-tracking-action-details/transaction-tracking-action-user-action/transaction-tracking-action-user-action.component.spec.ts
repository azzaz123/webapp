import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { of, throwError } from 'rxjs';
import { TransactionTrackingScreenTrackingEventsService } from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';

describe('TransactionTrackingActionUserActionComponent', () => {
  let component: TransactionTrackingActionUserActionComponent;
  let fixture: ComponentFixture<TransactionTrackingActionUserActionComponent>;
  let transactionTrackingService: TransactionTrackingService;
  let errorsService: ErrorsService;
  let transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user clicks on action', () => {
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
    });

    describe('and the request succeed...', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(of(''));

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

      it('should NOT show an error', () => {
        expect(errorsService.i18nError).not.toHaveBeenCalled();
      });
    });
  });
});
