/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick, discardPeriodicTasks } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  EventService, XmppService, MOCK_CONVERSATION, ItemService, HttpService, I18nService,
  ConversationService, MockTrackingService, ITEM_ID, Conversation, PersistencyService, UserService
} from 'shield';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TrackingService } from '../core/tracking/tracking.service';
import { AdService } from '../core/ad/ad.service';

class MockConversationService {

  sendRead(conversation: Conversation) {
  }

  archive(id: string) {
  }

  stream() {
  }

}

class MockUserService {

  public reportUser(): Observable<any> {
    return Observable.of({});
  }

  public updateBlockStatus() {
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

describe('Component: Chat', () => {

  let component: ChatComponent;
  let eventService: EventService;
  let conversationService: ConversationService;
  let conversation: Conversation;
  let userService: UserService;
  let itemService: MockItemService;
  let trackingService: TrackingService;
  let toastr: ToastrService;
  let modalService: NgbModal;
  let xmppService: XmppService;
  let persistencyService: PersistencyService;
  let adService: AdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        ChatComponent,
        {provide: ConversationService, useClass: MockConversationService},
        {provide: ItemService, useClass: MockItemService},
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: UserService, useClass: MockUserService},
        {provide: HttpService, useValue: {}},
        {provide: ToastrService, useClass: MockedToastr},
        {
          provide: PersistencyService, useValue: {
          getMetaInformation() {
            return Observable.of({});
          }
        }
        },
        I18nService,
        EventService,
        {
          provide: XmppService, useValue: {
          blockUser() {
          },
          unblockUser() {
          }
        }
        },
        {
          provide: AdService,
          useValue: {
            startAdsRefresh() {
            },
            stopAdsRefresh() {
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    component = TestBed.createComponent(ChatComponent).componentInstance;
    eventService = TestBed.get(EventService);
    conversationService = TestBed.get(ConversationService);
    userService = TestBed.get(UserService);
    trackingService = TestBed.get(TrackingService);
    itemService = TestBed.get(ItemService);
    toastr = TestBed.get(ToastrService);
    modalService = TestBed.get(NgbModal);
    xmppService = TestBed.get(XmppService);
    persistencyService = TestBed.get(PersistencyService);
    adService = TestBed.get(AdService);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onCurrentConversationChange', () => {

    beforeEach(() => {
      spyOn(conversationService, 'sendRead');
    });

    it('should set the current conversation', () => {
      conversation = MOCK_CONVERSATION();
      component.onCurrentConversationChange(conversation);
      expect(component.currentConversation).toBe(conversation);
    });

    it('should send the conversation status', () => {
      conversation = MOCK_CONVERSATION();
      component.onCurrentConversationChange(conversation);
      expect(conversationService.sendRead).toHaveBeenCalledWith(conversation);
    });

    it('should set which conversation is active', () => {
      conversation = MOCK_CONVERSATION();
      let conversationOld: Conversation = MOCK_CONVERSATION(2);
      conversationOld.active = true;
      component.currentConversation = conversationOld;
      component.onCurrentConversationChange(conversation);
      expect(conversationOld.active).toBeFalsy();
      expect(conversation.active).toBeTruthy();
    });

    it('should NOT send the conversation status if conversation is NULL', () => {
      component.onCurrentConversationChange(null);
      expect(conversationService.sendRead).not.toHaveBeenCalled();
    });
  });

  it('should set the conversationsLoaded value', () => {
    component.onLoaded({
      loaded: true,
      total: 10
    });
    expect(component.conversationsLoaded).toBeTruthy();
    expect(component.conversationsTotal).toBe(10);
    component.onLoaded({
      loaded: false,
      total: 0
    });
    expect(component.conversationsLoaded).toBeFalsy();
    expect(component.conversationsTotal).toBe(0);
  });

  describe('ngOnInit', () => {
    it('should set connection error', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_ERROR);
      expect(component.connectionError).toBeTruthy();
      expect(component.conversationsLoaded).toBeTruthy();
    });
    it('should call updateBlockStatus on USER_BLOCKED', () => {
      spyOn(userService, 'updateBlockStatus');
      component.ngOnInit();
      eventService.emit(EventService.USER_BLOCKED, '1');
      expect(userService.updateBlockStatus).toHaveBeenCalledWith('1', true);
    });
    it('should call updateBlockStatus on USER_UNBLOCKED', () => {
      spyOn(userService, 'updateBlockStatus');
      component.ngOnInit();
      eventService.emit(EventService.USER_UNBLOCKED, '2');
      expect(userService.updateBlockStatus).toHaveBeenCalledWith('2', false);
    });
    it('should not set firstLoad if getMetaInformation return meta', () => {
      component.ngOnInit();
      expect(component.firstLoad).toBeFalsy();
    });
    it('should set firstLoad true if getMetaInformation does NOT return meta', () => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw('err'));
      component.ngOnInit();
      expect(component.firstLoad).toBeTruthy();
    });
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
          component.currentConversation.legacyId);
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
        spyOn(itemService, 'reportListing').and.returnValue(Observable.throw({
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

  describe('reportUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report User Reason',
          reason: 1
        })
      });
    });
    it('should call the itemService.reportListing and then close the modal and show a toast', fakeAsync(() => {
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      component.reportUserAction();
      tick();
      expect(userService.reportUser).toHaveBeenCalledWith(component.currentConversation.user.id,
        component.currentConversation.item.legacyId,
        'Report User Reason',
        1,
        component.currentConversation.legacyId);
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

  describe('archiveConversation', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
      spyOn(conversationService, 'stream');
    });
    it('should close the modal, emit an event, clear the current conversation and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(conversationService, 'archive').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();
      component.archiveConversation();
      tick();
      expect(conversationService.archive).toHaveBeenCalledWith(component.currentConversation.id);
      expect(conversationService.stream).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith('The conversation has been archived correctly');
    }));
  });

  describe('blockUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
    });
    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(xmppService, 'blockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();
      component.blockUserAction();
      tick();
      expect(xmppService.blockUser).toHaveBeenCalledWith(component.currentConversation.user);
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
      spyOn(xmppService, 'unblockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();
      component.unblockUserAction();
      tick();
      expect(xmppService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastr.success).toHaveBeenCalledWith('The user has been unblocked');
    }));
  });

  it('should call startAdsRefresh when init component', () => {
    spyOn(adService, 'startAdsRefresh');
    component.ngOnInit();
    expect(adService.startAdsRefresh).toHaveBeenCalled();
  });

  it('should call stopAdsRefresh when destroy component', () => {
    component.ngOnInit();
    spyOn(adService, 'stopAdsRefresh');
    component.ngOnDestroy();
    expect(adService.stopAdsRefresh).toHaveBeenCalled();
  })

});
