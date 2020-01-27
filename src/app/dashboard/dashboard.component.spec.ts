/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { EventService } from '../core/event/event.service';
import { ConversationService } from '../core/conversation/conversation.service';
import { TrackingService } from '../core/tracking/tracking.service';
import { CallsService } from '../core/conversation/calls.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../tests/conversation.fixtures.spec';
import { Lead } from '../core/conversation/lead';
import { Call } from '../core/conversation/calls';
import { createCallsArray } from '../../tests/call.fixtures';
import { FeatureflagService } from '../core/user/featureflag.service';
import {
  FeatureFlagServiceMock,
  InboxServiceMock,
  LoggedGuardServiceMock,
  CallsServiceMock,
  ConversationServiceMock,
  InboxConversationServiceMock
} from '../../tests';
import { InboxService } from '../core/inbox/inbox.service';
import { InboxConversation } from '../chat/model';
import { createInboxConversationsArray } from '../../tests/inbox.fixtures.spec';
import { ChatModule } from '../chat/chat.module';
import { LoggedGuard } from '../core/user/logged.guard';
import { ChatComponent } from '../chat/chat.component';
import { InboxConversationService } from '../core/inbox/inbox-conversation.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let callService: CallsService;
  let conversationService: ConversationService;
  let trackingService: TrackingService;
  let eventService: EventService;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let featureflagService: FeatureflagService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ChatModule,
        RouterTestingModule.withRoutes([{
          path: 'chat',
          component: ChatComponent
        }])
      ],
      declarations: [
        DashboardComponent
      ],
      providers: [
        EventService,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        { provide: LoggedGuard, useClass: LoggedGuardServiceMock },
        { provide: CallsService, useClass: CallsServiceMock },
        { provide: ConversationService, useClass: ConversationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    callService = TestBed.get(CallsService);
    conversationService = TestBed.get(ConversationService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    inboxService = TestBed.get(InboxService);
    inboxConversationService = TestBed.get(InboxConversationService);
    featureflagService = TestBed.get(FeatureflagService);
    router = TestBed.get(Router);
    fixture.detectChanges();
    router.initialNavigation();
  });

  it('should create the app', async(() => {
    expect(fixture.debugElement.componentInstance).toBeTruthy();
  }));

  describe('ngOnInit', () => {

    it('should call methods', () => {
      spyOn<any>(component, 'getData');
      spyOn<any>(component, 'getTotals');

      component.ngOnInit();

      expect(component['getData']).toHaveBeenCalled();
      expect(component['getTotals']).toHaveBeenCalled();
    });

    it('should set archived lead', () => {
      component.ngOnInit();
      const LEAD: Lead = MOCK_CONVERSATION();

      eventService.emit(EventService.LEAD_ARCHIVED, LEAD);

      expect(component.archivedLead).toEqual(LEAD);
    });
  });

  describe('getData', () => {
    const CALLS: Call[] = createCallsArray(5);
    const CONVERSATIONS: InboxConversation[] = createInboxConversationsArray(4);

    beforeEach(() => {
      spyOn(callService, 'getPage').and.returnValue(Observable.of(CALLS));
      spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));
      spyOn(trackingService, 'track');
      inboxConversationService.conversations = CONVERSATIONS;

      component['getData']();
    });

    it('should set calls', () => {
      expect(callService.getPage).toHaveBeenCalledWith(1, false, null, 5);
      expect(component.calls).toEqual(CALLS);
    });

    it('should set conversations', () => {
      expect(component.conversations).toEqual(CONVERSATIONS);
    });

    it('should track the ConversationListActiveLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
    });

    it('should track the PhoneLeadListActiveLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED);
    });
  });

  describe('getTotals', () => {

    beforeEach(() => {
      spyOn(callService, 'getTotals').and.returnValue(Observable.of({
        calls: 6,
        archived: 9
      }));
      spyOn(conversationService, 'getTotals').and.returnValue(Observable.of({
        phonesShared: 2,
        meetings: 3,
        messages: 4,
        conversations: 5,
        archivedPhonesShared: 6,
        archivedMeetings: 7,
        archivedMessages: 8
      }));
      component.conversations = createInboxConversationsArray(3);

      component['getTotals']();
    });

    it('should set phonesTotal', () => {
      expect(component.phonesTotal).toBe(6 + 2);
    });

    it('should set messagesTotal', () => {
      expect(component.messagesTotal).toBe(5 - 2);
    });

    it('should return true if user has calls or messages', () => {
      expect(component.hasMessagesOrCalls).toBeTruthy();
    });
  });

  describe('trackPhoneLeadOpened', () => {
    it('should track the PHONE_LEAD_OPENED event', () => {
      spyOn(trackingService, 'track');

      component.trackPhoneLeadOpened();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_OPENED);
    });
  });

  describe('router', () => {
    it('should navigate to chat and open conversation', () => {
      const spy = spyOn(router, 'navigateByUrl');
      const conversation = createInboxConversationsArray(1, 'conversationId')[0];

      component.openConversation(conversation);

      expect(spy.calls.first().args[0]).toEqual(`/chat?conversationId=${conversation.id}`);
    });
  });

  describe('countTotalMessages', () => {
    it('should return 0 if conversations is null', () => {
      component.conversations = null;

      expect(component.countTotalMessages()).toEqual(0);
    });

    it('should return 0 if conversations is undefinied', () => {
      component.conversations = undefined;

      expect(component.countTotalMessages()).toEqual(0);
    });

    it('should calculate total messages if all messages are read', () => {
      component.conversations = createInboxConversationsArray(2);

      expect(component.countTotalMessages()).toEqual(2);
    });

    it('should calculate total messages if user has 2 conversations and 5 unread messages', () => {
      component.conversations = createInboxConversationsArray(2);
      component.conversations[0].unreadCounter = 5;

      expect(component.countTotalMessages()).toEqual(6);
    });
  });
});
