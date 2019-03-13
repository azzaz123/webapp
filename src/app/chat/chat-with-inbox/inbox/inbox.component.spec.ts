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

        expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.INBOX_LOADED);
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

});

