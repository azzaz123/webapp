
import {from, empty as observableEmpty,  Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdService } from '../core/ad/ad.service';
import { I18nService } from '../core/i18n/i18n.service';
import { EventService } from '../core/event/event.service';
import { UserService } from '../core/user/user.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../tests/inbox.fixtures.spec';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { InboxConversationService, InboxService } from './service';
import { ConversationService } from '../core/conversation/conversation.service';
import { ConversationServiceMock, InboxConversationServiceMock, InboxServiceMock } from '../../tests';
import { PhoneMethodResponse } from '../core/user/phone-method.interface';
import { InboxConversation, MessageStatus } from './model';
import { ChatComponent } from './chat.component';
import { TrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.service';
import { MockTrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.fixtures.spec';
import { SessionProfileDataLocation } from 'app/core/trust-and-safety/trust-and-safety.interface';
import { SEARCHID_STORAGE_NAME } from '../core/message/real-time.service';

class MockUserService {
  public isProfessional() {
    return of(true);
  }

  public getPhoneInfo(userId: string): Observable<PhoneMethodResponse> {
    return observableEmpty();
  }
}

describe('Component: ChatComponent with ItemId', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let eventService: EventService;
  let adService: AdService;
  let userService: UserService;
  let activatedRoute: ActivatedRoute;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let trustAndSafetyService: TrustAndSafetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [NgbModule, FormsModule, NgxPermissionsModule],
      providers: [
        ChatComponent,
        { provide: ConversationService, useClass: ConversationServiceMock },
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: UserService, useClass: MockUserService },
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        {
          provide: ActivatedRoute, useValue: {
            params: from([{}]),
            queryParams: from([{ itemId: 'itemId' }])
          }
        },
        I18nService,
        EventService,
        {
          provide: AdService,
          useValue: {
            adsRefresh() {
            }
          }
        },
        { provide: TrustAndSafetyService, useValue: MockTrustAndSafetyService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    adService = TestBed.inject(AdService);
    userService = TestBed.inject(UserService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inboxService = TestBed.inject(InboxService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    trustAndSafetyService = TestBed.inject(TrustAndSafetyService);
    fixture.autoDetectChanges();
  });

  it('should set the conversationsLoading value to FALSE when event.loading is false', () => {
    component.onLoad({
      loading: false,
      total: 0,
    });

    expect(component.conversationsLoading).toBe(false);
    expect(component.conversationsTotal).toBe(0);
  });

  it('should set the conversationsLoading value to TRUE when event.loading is true', () => {
    component.onLoad({
      loading: false,
      total: 0,
    });

    expect(component.conversationsLoading).toBe(false);
    expect(component.conversationsTotal).toBe(0);

    component.onLoad({
      loading: true,
      total: 10,
    });

    expect(component.conversationsLoading).toBe(true);
    expect(component.conversationsTotal).toBe(10);
  });

  describe('ngOnInit', () => {

    it('should set connectionError and conversationLoading to FALSE when a EventService.CONNECTION_ERROR is emitted', () => {
      spyOn(inboxConversationService, 'openConversationByItemId$');

      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_ERROR);

      expect(component.connectionError).toBe(true);
      expect(component.conversationsLoading).toBe(false);
      expect(inboxConversationService.openConversationByItemId$).not.toHaveBeenCalled();
      expect(component.conversationsLoading).toEqual(false);
    });

    it('should set connectionError to FALSE when a EventService.CONNECTION_RESTORED event is emitted', () => {
      spyOn(inboxConversationService, 'openConversationByItemId$');
      spyOn(inboxConversationService, 'resendPendingMessages');

      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(component.connectionError).toBe(false);
      expect(inboxConversationService.openConversationByItemId$).not.toHaveBeenCalled();
      expect(component.conversationsLoading).toEqual(false);
    });

    it('should set currentConversation when a EventService.CURRENT_CONVERSATION_SET is emitted', () => {
      const mockConversation = CREATE_MOCK_INBOX_CONVERSATION();
      spyOn(inboxConversationService, 'openConversationByItemId$');

      component.ngOnInit();
      eventService.emit(EventService.CURRENT_CONVERSATION_SET, mockConversation);

      expect(inboxConversationService.currentConversation).toEqual(mockConversation);
      expect(inboxConversationService.openConversationByItemId$).not.toHaveBeenCalled();
      expect(component.conversationsLoading).toEqual(false);
    });

    it('should set current conversation if link contains itemId', () => {
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);
      spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversation));
      spyOn(inboxConversationService, 'openConversationByConversationId$').and.returnValue(of(null));
      spyOn(userService, 'getPhoneInfo').and.returnValue(of(convertToParamMap({})));

      component.ngOnInit();

      expect(inboxConversationService.openConversationByItemId$).toHaveBeenCalledWith('itemId');
      expect(inboxConversationService.openConversationByConversationId$).not.toHaveBeenCalled();
      expect(component.conversationsLoading).toEqual(true);
    });

    it('should set connectionError to FALSE when a EventService.CHAT_RT_CONNECTED event is emitted', () => {
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      inboxConversation.messages[inboxConversation.messages.length - 1].status = MessageStatus.PENDING;

      spyOn(inboxConversationService, 'openConversationByItemId$');
      spyOn(inboxConversationService, 'resendPendingMessages');
      inboxConversationService.conversations = [inboxConversation];

      component.ngOnInit();
      eventService.emit(EventService.CHAT_RT_CONNECTED);

      expect(component.connectionError).toBe(false);
      expect(inboxConversationService.resendPendingMessages).toHaveBeenCalled();
      expect(inboxConversationService.openConversationByItemId$).not.toHaveBeenCalled();
    });

    it('should delegate profiling to trust and safety team', () => {
      spyOn(trustAndSafetyService, 'submitProfileIfNeeded');
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfileIfNeeded).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfileIfNeeded).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CHAT);
    });

    it('should save searchId if link contains searchId', () => {
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      const searchId = '123456789';
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);
      spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversation));
      spyOn(sessionStorage, 'setItem');

      activatedRoute.queryParams = from([{ itemId: 'itemId', searchId  }]);

      component.ngOnInit();

      expect(sessionStorage.setItem).toHaveBeenCalledWith(SEARCHID_STORAGE_NAME, searchId);
    });
  });

  describe('onChangeInboxOrArchivedDropdown', () => {

    it('should update model when conversations are NOT available', () => {
      const mockConversation = CREATE_MOCK_INBOX_CONVERSATION();
      inboxConversationService.currentConversation = mockConversation;
      component.onChangeInboxOrArchivedDropdown(false);

      expect(component.loadingError).toBeFalsy();
      expect(inboxConversationService.currentConversation).toEqual(mockConversation);
    });

    it('should update model when conversations are available', () => {
      inboxConversationService.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
      component.onChangeInboxOrArchivedDropdown(true);

      expect(component.loadingError).toBeTruthy();
      expect(inboxConversationService.currentConversation).toBeNull();
    });
  });
});

describe('Component: ChatWithInboxComponent with ConversationId', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let eventService: EventService;
  let adService: AdService;
  let userService: UserService;
  let activatedRoute: ActivatedRoute;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let trustAndSafetyService: TrustAndSafetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [NgbModule, FormsModule, NgxPermissionsModule],
      providers: [
        ChatComponent,
        { provide: ConversationService, useClass: ConversationServiceMock },
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: UserService, useClass: MockUserService },
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        {
          provide: ActivatedRoute, useValue: {
            params: from([{}]),
            queryParams: from([{ conversationId: 'itemId' }])
          }
        },
        I18nService,
        EventService,
        {
          provide: AdService,
          useValue: {
            adsRefresh() {
            }
          }
        },
        { provide: TrustAndSafetyService, useValue: MockTrustAndSafetyService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    adService = TestBed.inject(AdService);
    userService = TestBed.inject(UserService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inboxService = TestBed.inject(InboxService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    trustAndSafetyService = TestBed.inject(TrustAndSafetyService);
    fixture.autoDetectChanges();
  });

  describe('ngOnInit', () => {
    it('should open conversation by conversationId', () => {
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();

      spyOn(inboxService, 'isInboxReady').and.returnValue(true);
      spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversation));
      spyOn(inboxConversationService, 'openConversationByConversationId$').and.returnValue(of(inboxConversation));
      spyOn(userService, 'getPhoneInfo').and.returnValue(of({}));

      component.ngOnInit();

      expect(inboxConversationService.openConversationByItemId$).not.toHaveBeenCalled();
      expect(inboxConversationService.openConversationByConversationId$).toHaveBeenCalled();
    });

    it('should delegate profiling to trust and safety team', () => {
      spyOn(trustAndSafetyService, 'submitProfileIfNeeded');
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfileIfNeeded).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfileIfNeeded).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CHAT);
    });
  });
});
