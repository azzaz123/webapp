import { NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Call } from '@core/conversation/calls';
import { CallsService } from '@core/conversation/calls.service';
import { Lead } from '@core/conversation/lead';
import { EventService } from '@core/event/event.service';
import { RealTimeService } from '@core/message/real-time.service';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { LoggedGuard } from '@core/user/logged.guard';
import { ChatComponent } from '@private/features/chat/chat.component';
import { ChatModule } from '@private/features/chat/chat.module';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { CallsServiceMock } from '@fixtures/call-service.fixtures.spec';
import { createCallsArray } from '@fixtures/call.fixtures';
import { MOCK_CONVERSATION } from '@fixtures/conversation.fixtures.spec';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { InboxConversationServiceMock } from '@fixtures/inbox-coversation-service.fixtures.spec';
import { InboxServiceMock } from '@fixtures/inbox-service.fixtures.spec';
import { createInboxConversationsArray } from '@fixtures/inbox.fixtures.spec';
import { LoggedGuardServiceMock } from '@fixtures/logged-guard-service.fixtures.spec';
import { RealTimeServiceMock } from '@fixtures/real-time.fixtures.spec';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let callService: CallsService;
  let eventService: EventService;
  let inboxService: InboxService;
  let inboxConversationService: InboxConversationService;
  let router: Router;
  let realTimeService: RealTimeService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'chat',
              component: ChatComponent,
            },
          ]),
        ],
        declarations: [DashboardComponent],
        providers: [
          EventService,
          { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
          { provide: InboxService, useClass: InboxServiceMock },
          {
            provide: InboxConversationService,
            useClass: InboxConversationServiceMock,
          },
          { provide: LoggedGuard, useClass: LoggedGuardServiceMock },
          { provide: CallsService, useClass: CallsServiceMock },
          { provide: RealTimeService, useClass: RealTimeServiceMock },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    callService = TestBed.inject(CallsService);
    eventService = TestBed.inject(EventService);
    inboxService = TestBed.inject(InboxService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    router = TestBed.inject(Router);
    realTimeService = TestBed.inject(RealTimeService);
    fixture.detectChanges();

    // Prevent console warning when redirecting outside ngZone
    fixture.ngZone.run(() => router.initialNavigation());
  });

  it(
    'should create the app',
    waitForAsync(() => {
      expect(fixture.debugElement.componentInstance).toBeTruthy();
    })
  );

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
      spyOn(callService, 'getPage').and.returnValue(of(CALLS));
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
  });

  describe('getTotals', () => {
    beforeEach(() => {
      spyOn(callService, 'getTotals').and.returnValue(
        of({
          calls: 6,
          archived: 9,
        })
      );
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
