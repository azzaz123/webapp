/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Conversation } from '../core/conversation/conversation';
import {
  EventService, XmppService, MOCK_CONVERSATION, UserService, ItemService, HttpService, I18nService,
  ConversationService, TrackingService, MockTrackingService, ITEM_ID
} from 'shield';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

class MockConversationService {

  sendRead(conversation: Conversation) {
  }

  archive(id: string) {

  }

}

class MockUserService {

  public getBanReasons(): Observable<any> {
    return Observable.of(null);
  }

  public reportUser(): Observable<any> {
    return Observable.of({});
  }

  public syncStatus(): void {
  }
}

class MockItemService {

  public getBanReasons(): Observable<any> {
    return Observable.of(null);
  }

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
        I18nService,
        EventService,
        XmppService
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
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onCurrentConversationChange', () => {

    beforeEach(() => {
      spyOn(conversationService, 'sendRead');
      spyOn(userService, 'syncStatus');
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

    it('should call syncStatus', () => {
      conversation = MOCK_CONVERSATION();
      component.onCurrentConversationChange(conversation);
      expect(userService.syncStatus).toHaveBeenCalledWith(conversation.user);
    });

    it('should NOT send the conversation status if conversation is NULL', () => {
      component.onCurrentConversationChange(null);
      expect(conversationService.sendRead).not.toHaveBeenCalled();
      expect(userService.syncStatus).not.toHaveBeenCalled();
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

  it('should set connection error', () => {
    component.ngOnInit();
    eventService.emit(EventService.CONNECTION_ERROR);
    expect(component.connectionError).toBeTruthy();
    expect(component.conversationsLoaded).toBeTruthy();
  });
  describe('open', () => {
    it('should call the open method of the modal service', () => {
      spyOn((component as any).modalService, 'open');
      component.open('TEST');
      expect((component as any).modalService.open).toHaveBeenCalledWith('TEST');
    });
    it('should call the resetModals', () => {
      spyOn(component, 'resetModals');
      component.open('TEST');
      expect(component.resetModals).toHaveBeenCalled();
    });
  });
  describe('selectReportListingReason', () => {
    it('should set the selectedReportListingReason with the given value', () => {
      component.selectReportListingReason(1);
      expect(component.selectedReportListingReason).toBe(1);
    });
  });
  describe('selectReportUserReason', () => {
    it('should set the selectedReportUserReason with the given value', () => {
      component.selectReportUserReason(1);
      expect(component.selectedReportUserReason).toBe(1);
    });
  });
  describe('reportListingAction', () => {
    it('should call the itemService.reportListing and then close the modal and show a toast', () => {
      component.open('modal');
      component.reportListingReasonMessage = 'Report Listing Reason';
      spyOn(itemService, 'reportListing').and.callThrough();
      spyOn((component as any).modal, 'close');
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      component.selectedReportListingReason = 1;
      component.reportListingAction();
      expect(itemService.reportListing).toHaveBeenCalledWith(component.currentConversation.item.legacyId,
        component.reportListingReasonMessage,
        component.selectedReportListingReason,
        component.currentConversation.legacyId);
      expect((component as any).modal.close).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith('The listing has been reported correctly');
    });
    it('should track the ProductRepported event', () => {
      spyOn(trackingService, 'track');
      component.open('modal');
      component.reportListingReasonMessage = 'Report Listing Reason';
      spyOn(itemService, 'reportListing').and.callThrough();
      spyOn((component as any).modal, 'close');
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      component.selectedReportListingReason = 1;
      component.reportListingAction();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_REPPORTED, {
        product_id: ITEM_ID,
        reason_id: 1
      });
    });
  });

  describe('reportUserAction', () => {
    it('should call the itemService.reportListing and then close the modal and show a toast', () => {
      component.open('modal');
      component.reportListingReasonMessage = 'Report User Reason';
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn((component as any).modal, 'close');
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      component.selectedReportUserReason = 1;
      component.reportUserAction();
      expect(userService.reportUser).toHaveBeenCalledWith(component.currentConversation.user.id,
        component.currentConversation.item.legacyId,
        component.reportUserReasonMessage,
        component.selectedReportUserReason,
        component.currentConversation.legacyId);
      expect((component as any).modal.close).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith('The user has been reported correctly');
    });
    it('should track the UserProfileRepported event', () => {
      spyOn(trackingService, 'track');
      component.open('modal');
      component.reportListingReasonMessage = 'Report User Reason';
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn((component as any).modal, 'close');
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();
      component.selectedReportUserReason = 1;
      component.reportUserAction();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.USER_PROFILE_REPPORTED, {
        user_id: 'l1kmzn82zn3p',
        reason_id: 1
      });
    });
  });

  describe('resetModals', () => {
    it('should reset the messages from all the modals of the page', () => {
      component.selectedReportListingReason = 1;
      component.selectedReportUserReason = 1;
      component.reportListingReasonMessage = 'Report Listing Reason';
      component.reportUserReasonMessage = 'Report User Reason';
      component.resetModals();
      expect(component.reportUserReasonMessage).toBeNull();
      expect(component.reportListingReasonMessage).toBeNull();
      expect(component.selectedReportListingReason).toBeNull();
      expect(component.selectedReportUserReason).toBeNull();
    });
  });

  describe('archiveConversation', () => {
    it('should close the modal, emit an event, clear the current conversation and show the toast', () => {
      component.open('modal');
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(conversationService, 'archive').and.returnValue(Observable.of({}));
      spyOn((component as any).modal, 'close');
      spyOn(toastr, 'success').and.callThrough();
      component.archiveConversation();
      expect((component as any).modal.close).toHaveBeenCalled();
      expect(conversationService.archive).toHaveBeenCalledWith(component.currentConversation.id);
      expect(toastr.success).toHaveBeenCalledWith('The conversation has been archived correctly');
    });
  });

});
