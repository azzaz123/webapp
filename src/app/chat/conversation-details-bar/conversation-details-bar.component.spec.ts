import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ConversationDetailsBarComponent } from './conversation-details-bar.component';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ITEM_ID } from '../../../tests/item.fixtures.spec';
import { Observable, of, throwError } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventService } from '../../core/event/event.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { ToastService } from '../../layout/toast/toast.service';
import { ItemService } from '../../core/item/item.service';
import { UserService } from '../../core/user/user.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { BlockUserService, BlockUserXmppService, InboxConversationService } from '../service';
import { I18nService } from '../../core/i18n/i18n.service';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
import { User } from '../../core/user/user';
import { SharedModule } from '../../shared/shared.module';

class MockUserService {

  public user: User = new User('fakeId', 'microName', null,
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    null, null, null, null, null, null, null);

  public reportUser(): Observable<any> {
    return of({});
  }

  public isProfessional() {
    return of(true);
  }
}

class MockItemService {

  public reportListing(): Observable<any> {
    return of({});
  }
}

class MockConversationService {
  public loadMoreMessages() {
  }
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
  let itemService: ItemService;
  let userService: UserService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  let blockUserService: BlockUserService;
  let blockUserXmppService: BlockUserXmppService;
  let conversationService: InboxConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NgbModule,
        NgxPermissionsModule.forRoot()
      ],
      declarations: [ConversationDetailsBarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [EventService,
        {
          provide: RealTimeService, useValue: {
            sendRead() {
            }
          }
        },
       
        { provide: ItemService, useClass: MockItemService },
        { provide: UserService, useClass: MockUserService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: InboxConversationService, useClass: MockConversationService },
        { provide: BlockUserService, useClass: BlockUserServiceMock },
        I18nService,
        {
          provide: BlockUserXmppService, useValue: {
            blockUser() {
            },
            unblockUser() {
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationDetailsBarComponent);
    component = fixture.componentInstance;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    realTime = TestBed.inject(RealTimeService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);
    trackingService = TestBed.inject(TrackingService);
    itemService = TestBed.inject(ItemService);
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
          reason: 1
        })
      });
    });

    it('should call the userService.reportUser and then close the modal and show a toast', fakeAsync(() => {
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastService, 'show').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();

      component.reportUserAction();
      tick();

      expect(userService.reportUser).toHaveBeenCalledWith(component.currentConversation.user.id,
        component.currentConversation.item.id,
        component.currentConversation.id,
        1,
        'Report User Reason');
      expect(toastService.show).toHaveBeenCalledWith({text:'The user has been reported correctly', type:'success'});
    }));

    it('should track the UserProfileRepported event', fakeAsync(() => {
      spyOn(trackingService, 'track');
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastService, 'show').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();

      component.reportUserAction();
      tick();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.USER_PROFILE_REPPORTED, {
        user_id: 'l1kmzn82zn3p',
        reason_id: 1
      });
    }));
  });

  describe('reportListingAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report Listing Reason',
          reason: 1
        })
      });
    });

    describe('success', () => {
      it('should call the itemService.reportListing and then close the modal and show a toast', fakeAsync(() => {
        spyOn(itemService, 'reportListing').and.callThrough();
        spyOn(toastService, 'show').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(itemService.reportListing).toHaveBeenCalledWith(ITEM_ID, 'Report Listing Reason', 1);
        expect(toastService.show).toHaveBeenCalledWith({text:'The listing has been reported correctly', type:'success'});
      }));

      it('should track the ProductRepported event', fakeAsync(() => {
        spyOn(trackingService, 'track');
        spyOn(itemService, 'reportListing').and.callThrough();
        spyOn(toastService, 'show').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_REPPORTED, {
          product_id: ITEM_ID,
          reason_id: 1
        });
      }));
    });

    describe('error', () => {
      it('should open toast if error 403', fakeAsync(() => {
        spyOn(itemService, 'reportListing').and.returnValue(throwError({
          status: 403
        }));
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
        result: Promise.resolve()
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
      expect(toastService.show).toHaveBeenCalledWith({text:'The user has been blocked', type:'success'});
    }));
  });

  describe('blockUserAction if backend return 400', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
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
        result: Promise.resolve()
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
      expect(toastService.show).toHaveBeenCalledWith({text:'The user has been unblocked',type:'success'});
    }));
  });

  describe('unblockUserAction if backend return 400', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
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
