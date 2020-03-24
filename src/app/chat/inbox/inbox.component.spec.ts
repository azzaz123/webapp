/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { InboxComponent, InboxState } from './inbox.component';
import { InboxConversationComponent } from './inbox-conversation/inbox-conversation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InboxService, InboxConversationService } from '../service';
import { createInboxConversationsArray, CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
import { EventService } from '../../core/event/event.service';
import { InboxConversation } from '../model/inbox-conversation';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs';
import { AdService } from '../../core/ad/ad.service';
import { RemoteConsoleService } from '../../core/remote-console';
import { MockRemoteConsoleService } from '../../../tests';
import { User } from '../../core/user/user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewChatScreen, AnalyticsPageView } from '../../core/analytics/analytics-constants';
import { InboxUser } from '../model/inbox-user';
import { Item } from '../../core/item/item';
import { InboxItem } from '../model/inbox-item';

class AdServiceMock {
  adsRefresh() {
  }
}

describe('Component: InboxComponent', () => {
  let component: InboxComponent;
  let inboxService: InboxService;
  let eventService: EventService;
  let userService: UserService;
  let conversationService: InboxConversationService;
  let addService: AdService;
  let remoteConsoleService: RemoteConsoleService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule,
        NgxPermissionsModule,
        NgxPermissionsModule.forRoot()
      ],
      declarations: [InboxComponent, InboxConversationComponent],
      providers: [
        EventService,
        ...TEST_HTTP_PROVIDERS,
        { provide: AdService, useClass: AdServiceMock },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: InboxService, useValue: {
            loadMorePages() {
            },
            shouldLoadMorePages() {
            },
            loadMoreArchivedPages() {
            },
            shouldLoadMoreArchivedPages() {
            }
          }
        },
        {
          provide: UserService, useValue: {
            isProfessional(): Observable<boolean> {
              return Observable.of(false);
            },
            me(): Observable<User> {
              return Observable.of(MOCK_USER);
            },
            calculateDistanceFromItem(user: User | InboxUser, item: Item | InboxItem): number {
              return 5.5;
            }
          }
        },
        {
          provide: InboxConversationService, useValue: {
            openConversation() {
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    component = TestBed.createComponent(InboxComponent).componentInstance;
    inboxService = TestBed.get(InboxService);
    eventService = TestBed.get(EventService);
    userService = TestBed.get(UserService);
    addService = TestBed.get(AdService);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    conversationService = TestBed.get(InboxConversationService);
    analyticsService = TestBed.get(AnalyticsService);
  });

  describe('ngOnInit', () => {
    const mockedInboxConversations = createInboxConversationsArray(3);
    it('should subscribe to the NEW_MESSAGE event', () => {
      spyOn(eventService, 'subscribe').and.callThrough();

      component.ngOnInit();
      const evSubscribed = eventService.subscribe['calls'].allArgs().find(call => (call[0] === EventService.NEW_MESSAGE));

      expect(evSubscribed).toBeTruthy();
    });

    it('should set loading and loadingMore to false after the EventService.INBOX_LOADED event is triggered', () => {
      component.ngOnInit();
      eventService.emit(EventService.INBOX_LOADED);

      expect(component.loading).toBe(false);
      expect(component.loadingMore).toBe(false);
    });

    it('should set conversations to the conversations from EventService.INBOX_LOADED event when it is triggered', () => {
      component.ngOnInit();
      conversationService.conversations = mockedInboxConversations;
      eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

      expect(component.conversations).toEqual(mockedInboxConversations);
    });

    describe('when inboxService.conversations exists', () => {
      beforeEach(() => {
        conversationService.conversations = mockedInboxConversations;
      });

      it('should set conversations to the value of inboxService.conversations', () => {
        conversationService.conversations = mockedInboxConversations;
        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

        expect(component.conversations).toEqual(mockedInboxConversations);
      });

      it('should set loading to false', () => {
        component.ngOnInit();

        expect(component.loading).toBe(false);
      });

      it('should set errorRetrievingInbox to the value returned by inboxService.errorRetrievingInbox', () => {
        inboxService.errorRetrievingInbox = false;

        component.ngOnInit();

        expect(component.errorRetrievingInbox).toBe(false);

        inboxService.errorRetrievingInbox = true;

        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations, true);

        expect(component.errorRetrievingInbox).toBe(true);
      });
    });

    describe('when inboxService.conversations do not exists', () => {
      beforeEach(() => {
        spyOn(eventService, 'subscribe').and.callThrough();
      });
      it('should set loading to true', () => {
        component.conversations = null;

        component.ngOnInit();

        expect(component.loading).toBe(true);
      });

      it('should subscribe to EventService.CHAT_CAN_PROCESS_RT event with true', () => {
        component.ngOnInit();
        const evSubscribed = eventService.subscribe['calls'].allArgs().find(call => (call[0] === EventService.NEW_MESSAGE));

        expect(evSubscribed).toBeTruthy();
      });

      it('should set errorRetrievingInbox to the value returned by inboxService.errorRetrievingInbox', () => {
        inboxService.errorRetrievingInbox = false;

        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

        expect(component.errorRetrievingInbox).toBe(false);

        inboxService.errorRetrievingInbox = true;

        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

        expect(component.errorRetrievingInbox).toBe(true);
      });
    });

    describe('when a conversation is selected', () => {
      const conversation = mockedInboxConversations[0];

      const analyticsPageEvent: AnalyticsPageView<ViewChatScreen> = {
        name: ANALYTICS_EVENT_NAMES.ViewChatScreen,
        attributes: {
          itemId: conversation.item.id,
          conversationId: conversation.id,
          screenId: SCREEN_IDS.Chat
        }
      };

      describe('if the selected conversation is not the current conversation', () => {
        it('should send the View Chat Screen event', () => {
          spyOn(analyticsService, 'trackPageView');

          component.ngOnInit();
          eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);

          expect(analyticsService.trackPageView).toHaveBeenCalledWith(analyticsPageEvent);
        });
      });

      describe('if the selected conversation is the current conversation', () => {
        it('should not send the View Chat Screen event', () => {
          component['conversation'] = conversation;
          spyOn(analyticsService, 'trackPageView');

          component.ngOnInit();
          eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);

          expect(analyticsService.trackPageView).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('behaviour of New messages toast button', () => {
    const mockedInboxConversations = createInboxConversationsArray(1);
    const message = mockedInboxConversations[0].messages[0];
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set showNewMessagesToast to TRUE if a NEW_MEESAGE not fromSelf event is emitted AND the current scrollTop > 75', () => {
      component.scrollPanel = { nativeElement: { scrollTop: 100 } };
      message.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, message);

      expect(component.showNewMessagesToast).toBe(true);
    });

    it('should set showNewMessagesToast to true if a NEW_MEESAGE event is emitted AND the current scrollTop > 75', () => {
      component.scrollPanel = { nativeElement: { scrollTop: 100 } };
      message.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, message);

      expect(component.showNewMessagesToast).toBe(true);
    });

    it('should set showNewMessagesToast FALSE if a NEW_MEESAGE event is emitted AND the current scrollTop <= 75', () => {
      component.scrollPanel = { nativeElement: { scrollTop: 75 } };
      message.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, message);

      expect(component.showNewMessagesToast).toBe(false);
    });

    describe('handleScroll', () => {
      it('should set showNewMessagesToast to FALSE when handleScroll is called, if scrollTop >= 25 ', () => {
        const valuesToCheck = [25, 18, 0];
        component.scrollPanel = { nativeElement: { scrollTop: 100 } };
        message.fromSelf = false;
        eventService.emit(EventService.NEW_MESSAGE, message);
        expect(component.showNewMessagesToast).toBe(true);

        valuesToCheck.map(val => {
          component.scrollPanel = { nativeElement: { scrollTop: val } };
          component.handleScroll();
          expect(component.showNewMessagesToast).toBe(false);
        });
      });

      it('should set showNewMessagesToast to TRUE when handleScroll is called, if scrollTop > 25 ', () => {
        const valuesToCheck = [130, 77, 26];
        component.scrollPanel = { nativeElement: { scrollTop: 100 } };
        message.fromSelf = false;
        eventService.emit(EventService.NEW_MESSAGE, message);
        expect(component.showNewMessagesToast).toBe(true);

        valuesToCheck.map(val => {
          component.scrollPanel = { nativeElement: { scrollTop: val } };
          component.handleScroll();
          expect(component.showNewMessagesToast).toBe(true);
        });
      });
    });

    describe('scrollToTop', () => {
      it('should set scrollTop to 0 and set showNewMessagesToast to FALSE when called ', () => {
        component.scrollPanel = { nativeElement: { scrollTop: 100 } };
        component.showNewMessagesToast = true;
        spyOn(component, 'scrollToTop').and.callFake(() => {
          component.scrollPanel = { nativeElement: { scrollTop: 0 } };
          component.handleScroll();
        });

        component.scrollToTop();

        expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
        expect(component.showNewMessagesToast).toBe(false);
      });
    });
  });

  describe('setCurrentConversation', () => {
    let previouslySelectedConversation: InboxConversation;
    let newlySelectedConversation: InboxConversation;

    beforeEach(() => {
      previouslySelectedConversation = CREATE_MOCK_INBOX_CONVERSATION('old-conv-id');
      newlySelectedConversation = CREATE_MOCK_INBOX_CONVERSATION('some-new-conv-id');
    });

    it('should should call conversationService.openConversation with the new conversation', () => {
      spyOn(conversationService, 'openConversation').and.callThrough();
      spyOn(addService, 'adsRefresh');

      component.setCurrentConversation(newlySelectedConversation);

      expect(conversationService.openConversation).toHaveBeenCalledWith(newlySelectedConversation);
      expect(addService.adsRefresh).toHaveBeenCalled();
    });
  });

  it('should set conversation.active to FALSE if a conversation exists when ngOnDestroy is called', () => {
    const previouslySelectedConversation = CREATE_MOCK_INBOX_CONVERSATION();
    component.setCurrentConversation(previouslySelectedConversation);

    component.ngOnDestroy();

    expect(previouslySelectedConversation.active).toBe(false);
  });

  describe('loadMore', () => {
    it('should set loadingMore to true', () => {
      component.loadMore();

      expect(component.loadingMore).toBe(true);
    });

    it('should call inboxService to loadMorePages()', () => {
      spyOn(inboxService, 'loadMorePages');

      component.loadMore();

      expect(inboxService.loadMorePages).toHaveBeenCalled();
    });
  });

  describe('shouldLoadMore', () => {
    it('should return false when inboxService shouldLoadMorePages return false', () => {
      spyOn(inboxService, 'shouldLoadMorePages').and.returnValue(false);

      const result = component.showLoadMore();

      expect(result).toBe(false);
    });

    it('should return true when inboxService shouldLoadMorePages return true', () => {
      spyOn(inboxService, 'shouldLoadMorePages').and.returnValue(true);

      const result = component.showLoadMore();

      expect(result).toBe(true);
    });
  });

  describe('changeState', () => {
    it('should change state to Inbox', () => {
      spyOn(component.loadingError, 'emit');

      component.showInbox();
      expect(component.loadingError.emit).toHaveBeenCalled();
      expect(component.componentState).toEqual(InboxState.Inbox);
    });

    it('should change state to Archived', () => {
      spyOn(component.loadingError, 'emit');

      component.showArchive();
      expect(component.loadingError.emit).toHaveBeenCalled();
      expect(component.componentState).toEqual(InboxState.Archived);
    });
  });

  describe('sendLogWithNumberOfConversationsByConversationId', () => {
    const mockedInboxConversations = createInboxConversationsArray(3);
    const duplicateMockedInboxConversations = [...mockedInboxConversations, ...mockedInboxConversations];
    const duplicateIncorrectMockedInboxConversations = [
      { id: null }, { id: null }, { id: '' }, { id: '' }, { id: undefined }, { id: undefined }, {}
    ];

    it('should NOT send log with duplicate conversations', () => {
      spyOn(remoteConsoleService, 'sendDuplicateConversations');

      component.ngOnInit();
      eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

      expect(remoteConsoleService.sendDuplicateConversations).not.toHaveBeenCalled();
    });

    it('should send log with duplicate conversations', () => {
      const LOAD_MORE_CONVERSATIONS = true;
      spyOn(remoteConsoleService, 'sendDuplicateConversations');

      component.ngOnInit();
      eventService.emit(EventService.INBOX_LOADED, duplicateMockedInboxConversations, LOAD_MORE_CONVERSATIONS);

      expect(remoteConsoleService.sendDuplicateConversations)
      .toHaveBeenCalledWith(MOCK_USER.id, LOAD_MORE_CONVERSATIONS, { 1: 2, 2: 2, 3: 2 });
    });

    it('should send log with duplicate conversations if id of conversation is undefined, empty or null', () => {
      const LOAD_MORE_CONVERSATIONS = true;
      spyOn(remoteConsoleService, 'sendDuplicateConversations');

      component.ngOnInit();
      eventService.emit(EventService.INBOX_LOADED, duplicateIncorrectMockedInboxConversations, LOAD_MORE_CONVERSATIONS);

      expect(remoteConsoleService.sendDuplicateConversations)
      .toHaveBeenCalledWith(MOCK_USER.id, LOAD_MORE_CONVERSATIONS, { null: 2, '': 2, undefined: 3 });
    });
  });
});
