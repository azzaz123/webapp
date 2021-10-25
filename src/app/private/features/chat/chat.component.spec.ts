import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { USER_STRING_ID } from '@core/constants/string-ids.enum';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SEARCHID_STORAGE_NAME } from '@core/message/real-time.service';
import { PhoneMethodResponse } from '@core/user/phone-method.interface';
import { UserService } from '@core/user/user.service';
import { InboxConversationServiceMock, InboxServiceMock, CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/chat';
import { NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.fixtures.spec';
import { SessionProfileDataLocation } from 'app/core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EMPTY, from, Observable, of } from 'rxjs';
import { ChatComponent } from './chat.component';
import { AdsService } from '@core/ads/services';
import { InboxConversationService } from './core/inbox/inbox-conversation.service';
import { InboxService } from './core/inbox/inbox.service';
import { InboxConversation, MessageStatus, PhoneMethod } from './core/model';
import { SendPhoneComponent } from './modals';
import { PersonalDataInformationModal } from './modals/personal-data-information-modal/personal-data-information-modal.component';
import { ItemDetailRoutePipe } from '@shared/pipes';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';

class MockUserService {
  public isProfessional() {
    return of(true);
  }

  public getPhoneInfo(userId: string): Observable<PhoneMethodResponse> {
    return EMPTY;
  }
}

describe('Component: ChatComponent with ItemId', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let eventService: EventService;
  let adService: AdsService;
  let userService: UserService;
  let activatedRoute: ActivatedRoute;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let modalService: NgbModal;
  let trustAndSafetyService: TrustAndSafetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [NgbModule, FormsModule, NgxPermissionsModule],
      providers: [
        ChatComponent,
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: UserService, useClass: MockUserService },
        {
          provide: InboxConversationService,
          useClass: InboxConversationServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
            queryParams: from([{ itemId: 'itemId' }]),
          },
        },
        I18nService,
        EventService,
        ItemDetailRoutePipe,
        {
          provide: AdsService,
          useValue: {
            adsRefresh() {},
          },
        },
        { provide: TrustAndSafetyService, useValue: MockTrustAndSafetyService },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
        NgbModal,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    adService = TestBed.inject(AdsService);
    userService = TestBed.inject(UserService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inboxService = TestBed.inject(InboxService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    trustAndSafetyService = TestBed.inject(TrustAndSafetyService);
    modalService = TestBed.inject(NgbModal);
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
      spyOn(trustAndSafetyService, 'submitProfile');
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CHAT);
    });

    it('should save searchId if link contains searchId', () => {
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      const searchId = '123456789';
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);
      spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversation));
      spyOn(sessionStorage, 'setItem');

      activatedRoute.queryParams = from([{ itemId: 'itemId', searchId }]);

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

  describe('when opening a conversation with no messages', () => {
    beforeEach(() => {
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);
    });

    describe('and when the server notifies that seller is a car dealer', () => {
      beforeEach(() => {
        const inboxConversationWithoutMessages = CREATE_MOCK_INBOX_CONVERSATION();
        inboxConversationWithoutMessages.messages = [];
        spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversationWithoutMessages));
        const MOCK_PHONE_INFO = { phone_method: PhoneMethod.POP_UP };
        spyOn(userService, 'getPhoneInfo').and.returnValue(of(MOCK_PHONE_INFO));
      });

      it('should open a modal to send phone in chat', () => {
        spyOn(modalService, 'open');
        const expectedModalOptions: NgbModalOptions = {
          windowClass: 'phone-request',
          backdrop: 'static',
          keyboard: false,
        };

        component.ngOnInit();

        expect(modalService.open).toHaveBeenCalledWith(SendPhoneComponent, expectedModalOptions);
      });
    });

    describe('and the seller could request you the mail or cellphone', () => {
      it('should open a modal to notify the request information if the seller is YaEncontre', () => {
        const inboxConversationWithoutMessages = CREATE_MOCK_INBOX_CONVERSATION('123', USER_STRING_ID.YA_ENCONTRE);
        inboxConversationWithoutMessages.messages = [];
        const expectedModalOptions: NgbModalOptions = {
          windowClass: 'warning',
        };
        spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversationWithoutMessages));
        spyOn(modalService, 'open');

        component.ngOnInit();

        expect(modalService.open).toHaveBeenCalledWith(PersonalDataInformationModal, expectedModalOptions);
      });

      it('should not open a modal if the seller is not YaEncontre', () => {
        const inboxConversationWithoutMessages = CREATE_MOCK_INBOX_CONVERSATION('123', 'AAAAAAA');
        inboxConversationWithoutMessages.messages = [];
        spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversationWithoutMessages));
        spyOn(modalService, 'open');

        component.ngOnInit();

        expect(modalService.open).not.toBeCalled();
      });

      it('should redirect to the item if the modal is closed', fakeAsync(() => {
        const itemSlug = 'item-123';
        const expectedUrl = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${itemSlug}`;
        const inboxConversationWithoutMessages = CREATE_MOCK_INBOX_CONVERSATION('123', USER_STRING_ID.YA_ENCONTRE);
        inboxConversationWithoutMessages.messages = [];
        inboxConversationWithoutMessages.item.itemSlug = itemSlug;
        spyOn(inboxConversationService, 'openConversationByItemId$').and.returnValue(of(inboxConversationWithoutMessages));
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(),
        });

        component.ngOnInit();
        tick();

        expect(window.location.href).toBe(expectedUrl);
      }));
    });
  });
});

describe('Component: ChatWithInboxComponent with ConversationId', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let eventService: EventService;
  let adService: AdsService;
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
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: UserService, useClass: MockUserService },
        {
          provide: InboxConversationService,
          useClass: InboxConversationServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
            queryParams: from([{ conversationId: 'itemId' }]),
          },
        },
        I18nService,
        EventService,
        ItemDetailRoutePipe,
        {
          provide: AdsService,
          useValue: {
            adsRefresh() {},
          },
        },
        NgbModal,
        { provide: TrustAndSafetyService, useValue: MockTrustAndSafetyService },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    adService = TestBed.inject(AdsService);
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
      spyOn(trustAndSafetyService, 'submitProfile');
      spyOn(inboxService, 'isInboxReady').and.returnValue(true);

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CHAT);
    });
  });
});
