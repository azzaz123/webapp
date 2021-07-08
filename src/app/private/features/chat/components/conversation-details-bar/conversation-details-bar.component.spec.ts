import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RealTimeService } from '@core/message/real-time.service';
import { User } from '@core/user/user';
import { BlockUserXmppService } from '@private/features/chat/core/block-user/block-user-xmpp.service';
import { BlockUserService } from '@private/features/chat/core/block-user/block-user.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { MOCK_CONVERSATION } from '@fixtures/conversation.fixtures.spec';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/inbox.fixtures.spec';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { of, throwError } from 'rxjs';
import { ConversationDetailsBarComponent } from './conversation-details-bar.component';
import { ReportService } from '@core/trust-and-safety/report/report.service';
import { ITEM_REPORT_REASONS } from '@core/trust-and-safety/report/constants/item-report-reasons';
import { UserReportRequest } from '@core/trust-and-safety/report/interfaces/user/user-report-request.interface';
import { ErrorsService } from '@core/errors/errors.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

class MockConversationService {
  public loadMoreMessages() {}
}

class BlockUserServiceMock {
  blockUser(userHash: string) {
    return of();
  }

  unblockUser(userHash: string) {
    return of();
  }
}

describe('ConversationDetailsBarComponent', () => {
  let component: ConversationDetailsBarComponent;
  let fixture: ComponentFixture<ConversationDetailsBarComponent>;

  let realTime: RealTimeService;
  let eventService: EventService;
  let toastService: ToastService;
  let reportService: ReportService;
  let modalService: NgbModal;
  let blockUserService: BlockUserService;
  let blockUserXmppService: BlockUserXmppService;
  let conversationService: InboxConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, NgbModule, NgxPermissionsModule.forRoot()],
      declarations: [ConversationDetailsBarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        EventService,
        ToastService,
        ErrorsService,
        ReportService,
        {
          provide: RealTimeService,
          useValue: {
            sendRead() {},
          },
        },
        {
          provide: InboxConversationService,
          useClass: MockConversationService,
        },
        { provide: BlockUserService, useClass: BlockUserServiceMock },
        I18nService,
        {
          provide: BlockUserXmppService,
          useValue: {
            blockUser() {},
            unblockUser() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationDetailsBarComponent);
    component = fixture.componentInstance;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    realTime = TestBed.inject(RealTimeService);
    eventService = TestBed.inject(EventService);
    reportService = TestBed.inject(ReportService);
    toastService = TestBed.inject(ToastService);
    modalService = TestBed.inject(NgbModal);
    blockUserService = TestBed.inject(BlockUserService);
    blockUserXmppService = TestBed.inject(BlockUserXmppService);
    conversationService = TestBed.inject(InboxConversationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reportUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report User Reason',
          reason: 1,
        }),
      });
    });

    it('should send report to server, close modal and show a toast', fakeAsync(() => {
      spyOn(reportService, 'reportUser').and.returnValue(of({}));
      spyOn(toastService, 'show').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      const expectedUserReportRequest: UserReportRequest = {
        userId: component.currentConversation.user.id,
        itemHashId: component.currentConversation.item.id,
        conversationHash: component.currentConversation.id,
        reason: 1,
        comments: 'Report User Reason',
        targetCrm: 'zendesk',
      };

      component.reportUserAction();
      tick();

      expect(reportService.reportUser).toHaveBeenCalledWith(expectedUserReportRequest);
      expect(toastService.show).toHaveBeenCalledWith({
        text: 'The user has been reported correctly',
        type: TOAST_TYPES.SUCCESS,
      });
    }));
  });

  describe('reportListingAction', () => {
    const SELECTED_ITEM_REPORT_REASON = ITEM_REPORT_REASONS[0];

    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report Listing Reason',
          reason: SELECTED_ITEM_REPORT_REASON,
        }),
      });
    });

    describe('success', () => {
      it('should send report to backend, close modal and show a toast', fakeAsync(() => {
        spyOn(reportService, 'reportItem').and.returnValue(of({}));
        spyOn(toastService, 'show').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(reportService.reportItem).toHaveBeenCalledWith(ITEM_ID, 'Report Listing Reason', SELECTED_ITEM_REPORT_REASON);
        expect(toastService.show).toHaveBeenCalledWith({
          text: 'The listing has been reported correctly',
          type: TOAST_TYPES.SUCCESS,
        });
      }));
    });

    describe('error', () => {
      it('should open toast if server errors', fakeAsync(() => {
        spyOn(reportService, 'reportItem').and.returnValue(
          throwError({
            status: 403,
            error: 'Error',
          })
        );
        spyOn(toastService, 'show').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(toastService.show).toHaveBeenCalled();
      }));
    });
  });

  describe('blockUserAction if backend return 200', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(),
      });
    });

    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(toastService, 'show').and.callThrough();
      spyOn(blockUserService, 'blockUser').and.returnValue(of({}));
      spyOn(blockUserXmppService, 'blockUser').and.returnValue(of({}));

      component.blockUserAction();
      tick();

      expect(blockUserService.blockUser).toHaveBeenCalledWith(component.currentConversation.user.id);
      expect(blockUserXmppService.blockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastService.show).toHaveBeenCalledWith({
        text: 'The user has been blocked',
        type: TOAST_TYPES.SUCCESS,
      });
    }));
  });

  describe('blockUserAction if backend return 400', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(),
      });
    });

    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockUserService, 'blockUser').and.returnValue(throwError(400));
      spyOn(blockUserXmppService, 'blockUser').and.returnValue(of({}));
      spyOn(toastService, 'show').and.callThrough();

      component.blockUserAction();
      tick();

      expect(blockUserService.blockUser).toHaveBeenCalledWith(component.currentConversation.user.id);
      expect(blockUserXmppService.blockUser).not.toHaveBeenCalled();
      expect(toastService.show).not.toHaveBeenCalled();
    }));
  });

  describe('unblockUserAction if backend return 200', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(),
      });
    });

    it('should close the modal, call unblockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockUserXmppService, 'unblockUser').and.returnValue(of({}));
      spyOn(blockUserService, 'unblockUser').and.returnValue(of({}));
      spyOn(toastService, 'show').and.callThrough();

      component.unblockUserAction();
      tick();

      expect(blockUserService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user.id);
      expect(blockUserXmppService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastService.show).toHaveBeenCalledWith({
        text: 'The user has been unblocked',
        type: TOAST_TYPES.SUCCESS,
      });
    }));
  });

  describe('unblockUserAction if backend return 400', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(),
      });
    });

    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockUserService, 'unblockUser').and.returnValue(throwError(400));
      spyOn(blockUserXmppService, 'unblockUser').and.returnValue(of({}));
      spyOn(toastService, 'show').and.callThrough();

      component.unblockUserAction();
      tick();

      expect(blockUserService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user.id);
      expect(blockUserXmppService.unblockUser).not.toHaveBeenCalled();
      expect(toastService.show).not.toHaveBeenCalled();
    }));
  });
});
