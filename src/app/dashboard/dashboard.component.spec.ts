
import {of as observableOf,  Observable } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { EventService } from '../core/event/event.service';
import { TrackingService } from '../core/tracking/tracking.service';
import { CallsService } from '../core/conversation/calls.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../tests/conversation.fixtures.spec';
import { Lead } from '../core/conversation/lead';
import { Call } from '../core/conversation/calls';
import { createCallsArray } from '../../tests/call.fixtures';
import { FeatureflagService } from '../core/user/featureflag.service';
import {
  CallsServiceMock,
  FeatureFlagServiceMock,
  InboxConversationServiceMock,
  InboxServiceMock,
  LoggedGuardServiceMock
} from '../../tests';
import { InboxConversationService, InboxService } from '../chat/service';
import { InboxConversation } from '../chat/model';
import { createInboxConversationsArray } from '../../tests/inbox.fixtures.spec';
import { ChatModule } from '../chat/chat.module';
import { LoggedGuard } from '../core/user/logged.guard';
import { ChatComponent } from '../chat/chat.component';
import { RealTimeService } from '../core/message/real-time.service';
import { RealTimeServiceMock } from '../../tests/real-time.fixtures.spec';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let callService: CallsService;
  let trackingService: TrackingService;
  let eventService: EventService;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let router: Router;
  let realTimeService: RealTimeService;

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
        { provide: RealTimeService, useClass: RealTimeServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    callService = TestBed.get(CallsService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    inboxService = TestBed.get(InboxService);
    inboxConversationService = TestBed.get(InboxConversationService);
    router = TestBed.get(Router);
    realTimeService = TestBed.get(RealTimeService);
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
      spyOn(callService, 'getPage').and.returnValue(observableOf(CALLS));
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
      spyOn(callService, 'getTotals').and.returnValue(observableOf({
        calls: 6,
        archived: 9
      }));
      component.conversations = createInboxConversationsArray(3);

      component['getTotals']();
    });

    it('should set phonesTotal', () => {
      expect(component.phonesTotal).toBe(6);
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
      spyOn(inboxConversationService, 'openConversation');
      const conversation = createInboxConversationsArray(1, 'conversationId')[0];

      component.openConversation(conversation);

      expect(inboxConversationService.openConversation).toHaveBeenCalledTimes(1);
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
