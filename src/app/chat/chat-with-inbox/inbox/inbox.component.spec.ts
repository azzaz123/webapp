/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { InboxComponent } from './inbox.component';
import { InboxConversationComponent } from '../inbox/inbox-conversation/inbox-conversation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InboxService } from '../../../core/inbox/inbox.service';
import { createInboxConversationsArray, CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { EventService } from '../../../core/event/event.service';
import { ConversationService } from '../../../core/inbox/conversation.service';
import { InboxConversation } from './inbox-conversation/inbox-conversation';


describe('Component: InboxComponent', () => {
  let component: InboxComponent;
  let inboxService: InboxService;
  let http: HttpService;
  let eventService: EventService;
  let conversationService: ConversationService;

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
        {provide: InboxService, useValue: {
          loadMorePages() {},
          shouldLoadMorePages() {},
          loadMoreArchivedPages() {},
          shouldLoadMoreArchivedPages() {}
        }},
        {provide: ConversationService, useValue: {
          openConversation() {}
        }}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    component = TestBed.createComponent(InboxComponent).componentInstance;
    http = TestBed.get(HttpService);
    inboxService = TestBed.get(InboxService);
    eventService = TestBed.get(EventService);
    conversationService = TestBed.get(ConversationService);
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
      eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

      expect(component.conversations).toBe(mockedInboxConversations);
    });

    describe('when inboxService.conversations exists', () => {
      beforeEach(() => {
        inboxService.conversations = mockedInboxConversations;
      });
      it('should set conversations to the value of inboxService.conversations', () => {
        component.ngOnInit();

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

    it('should set active to FALSE to the currently selected conversation, if one exists', () => {
      component.setCurrentConversation(previouslySelectedConversation);
      expect(previouslySelectedConversation.active).toBe(true);

      component.setCurrentConversation(newlySelectedConversation);

      expect(previouslySelectedConversation.active).toBe(false);
    });

    it('should set component.conversation as the new conversation and set active to TRUE', () => {
      component.setCurrentConversation(newlySelectedConversation);

      expect(component['conversation']).toEqual(newlySelectedConversation);
      expect(newlySelectedConversation.active).toBe(true);
    });

    it('should should call conversationService.openConversation with the new conversation', () => {
      spyOn(conversationService, 'openConversation').and.callThrough();

      component.setCurrentConversation(newlySelectedConversation);

      expect(conversationService.openConversation).toHaveBeenCalledWith(newlySelectedConversation);
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
});
