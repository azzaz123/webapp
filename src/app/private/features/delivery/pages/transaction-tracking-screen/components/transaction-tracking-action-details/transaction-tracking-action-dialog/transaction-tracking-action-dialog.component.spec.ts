import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserAction } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG,
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITHOUT_ANALYTICS,
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS_2,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { of, throwError } from 'rxjs';
import { TransactionTrackingScreenStoreService } from '../../../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TRANSACTION_TRACKING_PATHS } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-screen-routing-constants';

import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { TransactionTrackingScreenTrackingEventsService } from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

describe('TransactionTrackingActionDialogComponent', () => {
  const MOCK_USER_ACTION = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG.positive.action as TransactionTrackingActionUserAction;
  const MOCK_MODAL_PROPERTIES: ConfirmationModalProperties = {
    title: MOCK_TRANSACTION_TRACKING_ACTION_DIALOG.title,
    description: MOCK_TRANSACTION_TRACKING_ACTION_DIALOG.description,
    confirmMessage: MOCK_TRANSACTION_TRACKING_ACTION_DIALOG.positive.title,
    cancelMessage: MOCK_TRANSACTION_TRACKING_ACTION_DIALOG.negative?.title,
    confirmColor: COLORS.WALLA_MAIN,
  };
  const componentInstance: any = {};
  const MOCK_REQUEST_ID = '1827382738273';

  let component: TransactionTrackingActionDialogComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDialogComponent>;
  let modalService: NgbModal;
  let transactionTrackingService: TransactionTrackingService;
  let errorsService: ErrorsService;
  let de: DebugElement;
  let storeService: TransactionTrackingScreenStoreService;
  let router: Router;
  let transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingActionDialogComponent],
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
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: componentInstance,
                result: Promise.resolve(),
              };
            },
          },
        },
        {
          provide: TransactionTrackingScreenStoreService,
          useValue: {
            refresh() {},
          },
        },
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
    fixture = TestBed.createComponent(TransactionTrackingActionDialogComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.dialogAction = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG;
    modalService = TestBed.inject(NgbModal);
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    errorsService = TestBed.inject(ErrorsService);
    storeService = TestBed.inject(TransactionTrackingScreenStoreService);
    transactionTrackingScreenTrackingEventsService = TestBed.inject(TransactionTrackingScreenTrackingEventsService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we click in the modal wrapper', () => {
    let wrapperDialog: DebugElement;

    beforeEach(() => {
      spyOn(storeService, 'refresh');
      spyOn(router, 'navigate');
      wrapperDialog = de.query(By.css('div'));
    });

    describe('and the user accepts the dialog action', () => {
      beforeEach(() => {
        spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        spyOn(modalService, 'open').and.callThrough();
        spyOn(errorsService, 'i18nError');
      });

      describe('and the request fails...', () => {
        beforeEach(() => {
          spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(throwError('error! :P'));

          wrapperDialog.nativeElement.click();
          fixture.detectChanges();
        });

        it('should open with the action dialog properties', () => {
          component['modalRef'] = <any>{
            componentInstance: componentInstance,
          };

          expect(component['modalRef'].componentInstance.properties).toStrictEqual(MOCK_MODAL_PROPERTIES);
        });

        it('should send the request user action petition', () => {
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(MOCK_USER_ACTION.transactionId, MOCK_USER_ACTION.name);
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

        it('should NOT track the event', () => {
          wrapperDialog.nativeElement.click();

          expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
        });
      });

      describe('and the request succeed...', () => {
        beforeEach(() => {
          spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(of(null));
        });

        describe('and the action has analytics', () => {
          beforeEach(() => {
            component.dialogAction = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS_2;
            fixture.detectChanges();
          });

          it('should track the event', () => {
            wrapperDialog.nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
              MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS_2.positive.action.analytics.requestId,
              MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS_2.positive.action.analytics.source
            );
          });
        });

        describe('and the action has NOT analytics', () => {
          beforeEach(() => {
            component.dialogAction = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITHOUT_ANALYTICS;
            fixture.detectChanges();
          });

          it('should NOT track the event', () => {
            wrapperDialog.nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
          });
        });

        describe('and we are on the TTS instructions page', () => {
          beforeEach(() => {
            jest
              .spyOn(router, 'url', 'get')
              .mockReturnValue(`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/1234/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}`);

            wrapperDialog.nativeElement.click();
          });

          it('should open with the action dialog properties', () => {
            component['modalRef'] = <any>{
              componentInstance: componentInstance,
            };

            expect(component['modalRef'].componentInstance.properties).toStrictEqual(MOCK_MODAL_PROPERTIES);
          });

          it('should send the request user action petition', () => {
            expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
            expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(MOCK_USER_ACTION.transactionId, MOCK_USER_ACTION.name);
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

            wrapperDialog.nativeElement.click();
          });

          it('should open with the action dialog properties', () => {
            component['modalRef'] = <any>{
              componentInstance: componentInstance,
            };

            expect(component['modalRef'].componentInstance.properties).toStrictEqual(MOCK_MODAL_PROPERTIES);
          });

          it('should send the request user action petition', () => {
            expect(transactionTrackingService.sendUserAction).toHaveBeenCalledTimes(1);
            expect(transactionTrackingService.sendUserAction).toHaveBeenCalledWith(MOCK_USER_ACTION.transactionId, MOCK_USER_ACTION.name);
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

    describe('and the user rejects the dialog action', () => {
      beforeEach(() => {
        spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance });
        spyOn(transactionTrackingService, 'sendUserAction');

        wrapperDialog.nativeElement.click();
      });

      it('should NOT refresh the transaction tracking store', () => {
        expect(storeService.refresh).not.toHaveBeenCalled();
      });

      it('should stay at the same page', () => {
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should open with the action dialog properties', () => {
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };

        expect(component['modalRef'].componentInstance.properties).toStrictEqual(MOCK_MODAL_PROPERTIES);
      });

      it('should NOT send the request user action petition', () => {
        expect(transactionTrackingService.sendUserAction).not.toHaveBeenCalled();
      });

      it('should NOT track the event', () => {
        wrapperDialog.nativeElement.click();

        expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
      });
    });
  });
});
