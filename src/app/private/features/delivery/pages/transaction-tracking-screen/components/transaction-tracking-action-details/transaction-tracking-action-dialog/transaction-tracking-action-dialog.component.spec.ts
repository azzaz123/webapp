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
import { MOCK_TRANSACTION_TRACKING_ACTION_DIALOG } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { of, throwError } from 'rxjs';
import { TransactionTrackingScreenStoreService } from '../../../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';

import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';

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

  let component: TransactionTrackingActionDialogComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDialogComponent>;
  let modalService: NgbModal;
  let transactionTrackingService: TransactionTrackingService;
  let errorsService: ErrorsService;
  let de: DebugElement;

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
                get: () => '1234',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            url: '/path',
            navigate() {},
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we click in the modal wrapper', () => {
    let wrapperDialog: DebugElement;

    beforeEach(() => {
      wrapperDialog = de.query(By.css('div'));
    });

    describe('and the user accepts the dialog action', () => {
      beforeEach(() => {
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
      });

      describe('and the request succeed...', () => {
        beforeEach(() => {
          spyOn(transactionTrackingService, 'sendUserAction').and.returnValue(of(null));

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
      });
    });

    describe('and the user rejects the dialog action', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance });
        spyOn(transactionTrackingService, 'sendUserAction');

        wrapperDialog.nativeElement.click();
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
    });
  });
});
