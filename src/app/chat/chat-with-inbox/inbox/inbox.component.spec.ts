/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { InboxComponent } from './inbox.component';
import { InboxConversationComponent } from '../inbox-conversation/inbox-conversation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InboxService } from '../../../core/inbox/inbox.service';
import { createInboxConversationsArray } from '../../../../tests/inbox.fixtures.spec';
import { EventService } from '../../../core/event/event.service';


describe('Component: ConversationsPanel', () => {

  let component: InboxComponent;
  let inboxService: InboxService;
  let http: HttpService;
  let eventService: EventService;

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
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: InboxService, useValue: {}},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    component = TestBed.createComponent(InboxComponent).componentInstance;
    http = TestBed.get(HttpService);
    inboxService = TestBed.get(InboxService);
    eventService = TestBed.get(EventService);
  });


  describe('ngOnInit', () => {
    it('should set loading to true when the component is initialized', () => {
      component.ngOnInit();

      expect(component.loading).toBe(true);
    });

    it('should subscribe to the NEW_MESSAGE event', () => {
      spyOn(eventService, 'subscribe').and.callThrough();

      component.ngOnInit();
      const evSubscribed = eventService.subscribe['calls'].allArgs().find(call => (call[0] === EventService.NEW_MESSAGE));

      expect(evSubscribed).toBeTruthy();
    });

    describe('when inboxService.conversations exists', () => {
      const mockedInboxConversations = createInboxConversationsArray(3);
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
    });

    describe('when inboxService.conversations do not exists', () => {
      const mockedInboxConversations = createInboxConversationsArray(3);
      beforeEach(() => {
        spyOn(eventService, 'subscribe').and.callThrough();
      });
      it('should subscribe to EventService.CHAT_CAN_PROCESS_RT event with true', () => {
        component.ngOnInit();
        const evSubscribed = eventService.subscribe['calls'].allArgs().find(call => (call[0] === EventService.NEW_MESSAGE));

        expect(evSubscribed).toBeTruthy();
      });

      it('should set loading to false after the EventService.INBOX_LOADED event is triggered', () => {
        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED);

        expect(component.loading).toBe(false);
      });

      it('should set conversations to the conversations from EventService.INBOX_LOADED event when it is triggered', () => {
        component.ngOnInit();
        eventService.emit(EventService.INBOX_LOADED, mockedInboxConversations);

        expect(component.conversations).toBe(mockedInboxConversations);
      });
    });
  });

  describe('behaviour of New messages toast button', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set showNewMessagesToast to TRUE if a NEW_MEESAGE event is emitted AND the currect scrollTop > 75', () => {
      component.scrollPanel = { nativeElement: { scrollTop: 100 } };

      eventService.emit(EventService.NEW_MESSAGE);

      expect(component.showNewMessagesToast).toBe(true);
    });

    it('should set showNewMessagesToast FALSE if a NEW_MEESAGE event is emitted AND the currect scrollTop <= 75', () => {
      component.scrollPanel = { nativeElement: { scrollTop: 75 } };

      eventService.emit(EventService.NEW_MESSAGE);

      expect(component.showNewMessagesToast).toBe(false);
    });

    describe('handleScroll', () => {
      it('should set showNewMessagesToast to FALSE when handleScroll is called, if scrollTop >= 25 ', () => {
        const valuesToCheck = [25, 18, 0];
        component.scrollPanel = { nativeElement: { scrollTop: 100 } };
        eventService.emit(EventService.NEW_MESSAGE);
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
        eventService.emit(EventService.NEW_MESSAGE);
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
});

