import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { CurrentConversationComponent } from './current-conversation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { InboxMessage } from '../message/inbox-message';
import { USER_ID } from '../../../../tests/user.fixtures.spec';
import { messageStatus } from '../../../core/message/message';
import { RealTimeService } from '../../../core/message/real-time.service';
import { EventService } from '../../../core/event/event.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../../../core/item/item.service';
import { UserService } from '../../../core/user/user.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ITEM_ID } from '../../../../tests/item.fixtures.spec';
import { BlockUserService } from '../../../core/conversation/block-user.service';
import { ConversationService } from '../../../core/inbox/conversation.service';
import { User } from '../../../core/user/user';

class MockUserService {

  public user: User = new User('fakeId', 'microName', null,
                                null, null, null, null, null, null,
                                null, null, null, null, null, null,
                                null, null, null, null, null, null, null);

  public reportUser(): Observable<any> {
    return Observable.of({});
  }

  public isProfessional() {
    return Observable.of(true);
  }
}

class MockItemService {

  public reportListing(): Observable<any> {
    return Observable.of({});
  }
}

class MockedToastr {

  success(message: string, title?: string, optionsOverride?: any): any {
  }
}

class MockConversationService {
  public loadMoreMessages() {}
}

fdescribe('CurrentConversationComponent', () => {
  let component: CurrentConversationComponent;
  let fixture: ComponentFixture<CurrentConversationComponent>;
  let realTime: RealTimeService;
  let eventService: EventService;
  let toastr: ToastrService;
  let itemService: MockItemService;
  let userService: UserService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  let blockService: BlockUserService;
  let conversationService: ConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule.forRoot(), MomentModule ],
      declarations: [ CurrentConversationComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ EventService,
        { provide: RealTimeService, useValue: { sendRead() {} }},
        { provide: ToastrService, useClass: MockedToastr },
        { provide: ItemService, useClass: MockItemService },
        { provide: UserService, useClass: MockUserService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ConversationService, useClass: MockConversationService },
        I18nService,
        {
          provide: BlockUserService, useValue: {
            blockUser() {
            },
            unblockUser() {
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(CurrentConversationComponent);
    component = fixture.componentInstance;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    realTime = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
    userService = TestBed.get(UserService);
    trackingService = TestBed.get(TrackingService);
    itemService = TestBed.get(ItemService);
    toastr = TestBed.get(ToastrService);
    modalService = TestBed.get(NgbModal);
    blockService = TestBed.get(BlockUserService);
    conversationService = TestBed.get(ConversationService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(realTime, 'sendRead');
    });

    describe('when the browser window is visible', () => {
      beforeEach(() => {
        spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());
      });

      it(`should call realTime.sendRead when a MESSAGE_ADDED event is triggered with a message belonging
      to the currentConversation`, fakeAsync(() => {
        const newMessage = new InboxMessage('someId', component.currentConversation.id, 'hola!',
        component.currentConversation.messages[0].from, false, new Date(), messageStatus.RECEIVED);

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).toHaveBeenCalledWith('fakeId', component.currentConversation.id);
      }));

      it(`should NOT call realTime.sendRead when a MESSAGE_ADDED event is triggered with a message NOT belonging
        to the currentConversation`, fakeAsync(() => {
        const newMessage = new InboxMessage('someId', 'other-thread-id', 'hola!',
        component.currentConversation.messages[0].from, true, new Date(), messageStatus.RECEIVED);

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).not.toHaveBeenCalled();
      }));
    });

    it('should  NOT call realTime.sendRead when a MESSAGE_ADDED event AND the browser window is NOT visible', fakeAsync(() => {
      spyOn(Visibility, 'onVisible').and.callFake(() => false);
      const newMessage = new InboxMessage('someId', component.currentConversation.id, 'hola!',
        component.currentConversation.messages[0].from, true, new Date(), messageStatus.RECEIVED);

      component.ngOnInit();
      eventService.emit(EventService.MESSAGE_ADDED, newMessage);
      tick(1000);

      expect(realTime.sendRead).not.toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => component.ngOnInit());

    it('should unsubscribe from the chat events', () => {
      component.ngOnDestroy();

      expect(component['newMessageSubscription'].closed).toBe(true);
    });

    it('should set currentConversation to null', () => {
      component.ngOnDestroy();

      expect(component.currentConversation).toBe(null);
    });
  });

  describe('describe dateIsThisYear', () => {
    it('should return TRUE when the date is in the current calendar year', () => {
      const expectedResult = component.dateIsThisYear(new Date());

      expect(expectedResult).toBe(true);
    });

    it('should return FALSE when the date is NOT in the current calendar year', () => {
      const expectedResult = component.dateIsThisYear(new Date('1986/05/08'));

      expect(expectedResult).toBe(false);
    });
  });

  describe('showDate', () => {
    let currentMessage;
    let nextMessage;
    beforeEach(() => {
      currentMessage = component.currentConversation.messages[0];
      nextMessage = new InboxMessage('123', component.currentConversation.id, 'new msg', USER_ID, true, new Date(),
      messageStatus.RECEIVED);
    });

    it('should return TRUE if it is called without a nextMessage parameter', () => {
      const value = component.showDate(component.currentConversation.messages[0], null);

      expect(value).toBe(true);
    });

    it('should return FALSE if called with a currentMessage and nextMessage that have the same date (same day)', () => {
      const nextMessageDate = new Date(currentMessage.date);
      nextMessageDate.setTime(nextMessageDate.getTime() + 1 * 60 * 60 * 1000); // adds 1 hour
      nextMessage.date = nextMessageDate;

      const value = component.showDate(currentMessage, nextMessage);

      expect(value).toBe(false);
    });

    it('should return TRUE if called with a currentMessage and nextMessage that have the different dates (not same day)', () => {
      const nextMessageDate = new Date(currentMessage.date);
      nextMessageDate.setDate(nextMessageDate.getDate() + 1); // adds 1 day
      nextMessage.date = nextMessageDate;

      const value = component.showDate(currentMessage, nextMessage);

      expect(value).toBe(true);
    });
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
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();

      component.reportUserAction();
      tick();

      expect(userService.reportUser).toHaveBeenCalledWith(component.currentConversation.user.id,
        component.currentConversation.item.id,
        'Report User Reason',
        1,
        component.currentConversation.id);
      expect(toastr.success).toHaveBeenCalledWith('The user has been reported correctly');
    }));

    it('should track the UserProfileRepported event', fakeAsync(() => {
      spyOn(trackingService, 'track');
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastr, 'success').and.callThrough();
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
        spyOn(toastr, 'success').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(itemService.reportListing).toHaveBeenCalledWith(ITEM_ID,
          'Report Listing Reason',
          1,
          component.currentConversation.id);
        expect(toastr.success).toHaveBeenCalledWith('The listing has been reported correctly');
      }));

      it('should track the ProductRepported event', fakeAsync(() => {
        spyOn(trackingService, 'track');
        spyOn(itemService, 'reportListing').and.callThrough();
        spyOn(toastr, 'success').and.callThrough();
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
      it('should open toastr if error 403', fakeAsync(() => {
        spyOn(itemService, 'reportListing').and.returnValue(Observable.throwError({
          status: 403
        }));
        spyOn(toastr, 'success').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(toastr.success).toHaveBeenCalled();
      }));
    });
  });

  describe('blockUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
    });

    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockService, 'blockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();

      component.blockUserAction();
      tick();

      expect(blockService.blockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastr.success).toHaveBeenCalledWith('The user has been blocked');
    }));
  });

  describe('unblockUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
    });

    it('should close the modal, call unblockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockService, 'unblockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();

      component.unblockUserAction();
      tick();

      expect(blockService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastr.success).toHaveBeenCalledWith('The user has been unblocked');
    }));
  });

  describe('hasMoreMessages', () => {
    it('should return TRUE if currentConversation has nextPageToken', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.nextPageToken = 'someToken';

      const result = component.hasMoreMessages();

      expect(result).toBeTruthy();
    });

    it('should return FALSE if currentConversation has not nextPageToken', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.nextPageToken = null;

      const result = component.hasMoreMessages();

      expect(result).toBeFalsy();
    });
  });

  describe('loadMoreMessages', () => {
    it('should call conversationService to loadMoreMessages() if isLoadingMore is FALSE', () => {
      spyOn(conversationService, 'loadMoreMessages').and.callThrough();
      component['isLoadingMoreMessages'] = false;

      component.loadMoreMessages();

      expect(conversationService.loadMoreMessages).toHaveBeenCalled();
    });

    it('should NOT call conversationService to loadMoreMessages() if isLoadingMore is FALSE', () => {
      spyOn(conversationService, 'loadMoreMessages').and.callThrough();
      component['isLoadingMoreMessages'] = true;

      component.loadMoreMessages();

      expect(conversationService.loadMoreMessages).not.toHaveBeenCalled();
    });
  });
});
