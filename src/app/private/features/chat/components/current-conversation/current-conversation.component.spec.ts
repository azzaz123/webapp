import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RealTimeService } from '@core/message/real-time.service';
import { RemoteConsoleService } from '@core/remote-console';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { MaliciousConversationModalComponent } from '@private/features/chat/modals/malicious-conversation-modal/malicious-conversation-modal.component';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_CONVERSATION } from '@fixtures/conversation.fixtures.spec';
import { InboxConversationServiceMock } from '@fixtures/inbox-coversation-service.fixtures.spec';
import {
  CREATE_MOCK_INBOX_CONVERSATION,
  MOCK_INBOX_CONVERSATION_BASIC,
  MOCK_INBOX_CONVERSATION_WITH_MALICIOUS_USER,
  MOCK_INBOX_CONVERSATION_WITH_UNSUBSCRIBED_USER,
} from '@fixtures/inbox.fixtures.spec';
import { RealTimeServiceMock } from '@fixtures/real-time.fixtures.spec';
import { MockRemoteConsoleService } from '@fixtures/remote-console.fixtures.spec';
import { MOCK_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickBannedUserChatPopUpCloseButton,
  ClickBannedUserChatPopUpExitButton,
  SCREEN_IDS,
  ViewBannedUserChatPopUp,
} from 'app/core/analytics/analytics-constants';
import { UserService } from 'app/core/user/user.service';
import { DateCalendarPipe } from 'app/shared/pipes';
import { NgxPermissionsModule } from 'ngx-permissions';
import * as Visibility from 'visibilityjs';
import { CurrentConversationComponent } from './current-conversation.component';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';

describe('CurrentConversationComponent', () => {
  let component: CurrentConversationComponent;
  let fixture: ComponentFixture<CurrentConversationComponent>;
  let realTime: RealTimeService;
  let eventService: EventService;
  let conversationService: InboxConversationService;
  let remoteConsoleService: RemoteConsoleService;
  let analyticsService: AnalyticsService;
  let modalService: NgbModal;
  let userService: UserService;
  let modalMockResult: Promise<{}>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot()],
        declarations: [CurrentConversationComponent, DateCalendarPipe],
        providers: [
          EventService,
          NgbModal,
          { provide: RealTimeService, useClass: RealTimeServiceMock },
          {
            provide: InboxConversationService,
            useClass: InboxConversationServiceMock,
          },
          { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: modalMockResult,
                  componentInstance: {
                    chatContext: {
                      userId: userService.user.id,
                      bannedUserId: component.currentConversation?.user?.id,
                      conversationId: component.currentConversation?.id,
                      screenId: SCREEN_IDS.BannedUserChatPopUp,
                    },
                  },
                };
              },
            },
          },
          {
            provide: AdsService,
            useValue: MockAdsService,
          },
          I18nService,
          MomentCalendarSpecService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentConversationComponent);
    component = fixture.componentInstance;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    modalMockResult = Promise.resolve({});

    realTime = TestBed.inject(RealTimeService);
    eventService = TestBed.inject(EventService);
    conversationService = TestBed.inject(InboxConversationService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    modalService = TestBed.inject(NgbModal);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(realTime, 'sendRead');
    });

    describe('when the browser window is visible', () => {
      beforeEach(() => {
        spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());
      });

      it(`should call realTime.sendRead when a MESSAGE_ADDED event is triggered with a message belonging
      to the currentConversation`, fakeAsync(() => {
        const newMessage = new InboxMessage(
          'someId',
          component.currentConversation.id,
          'hola!',
          component.currentConversation.messages[0].from,
          false,
          new Date(),
          MessageStatus.RECEIVED,
          MessageType.TEXT
        );

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).toHaveBeenCalledWith(newMessage.from, component.currentConversation.id);
      }));

      it(`should NOT call realTime.sendRead when a MESSAGE_ADDED event is triggered with a message NOT belonging
        to the currentConversation`, fakeAsync(() => {
        const newMessage = new InboxMessage(
          'someId',
          'other-thread-id',
          'hola!',
          component.currentConversation.messages[0].from,
          true,
          new Date(),
          MessageStatus.RECEIVED,
          MessageType.TEXT
        );

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).not.toHaveBeenCalled();
      }));
    });

    it('should  NOT call realTime.sendRead when a MESSAGE_ADDED event AND the browser window is NOT visible', fakeAsync(() => {
      spyOn(Visibility, 'onVisible').and.callFake(() => false);
      const newMessage = new InboxMessage(
        'someId',
        component.currentConversation.id,
        'hola!',
        component.currentConversation.messages[0].from,
        true,
        new Date(),
        MessageStatus.RECEIVED,
        MessageType.TEXT
      );

      component.ngOnInit();
      eventService.emit(EventService.MESSAGE_ADDED, newMessage);
      tick(1000);

      expect(realTime.sendRead).not.toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => component.ngOnInit());

    it('should unsubscribe from the chat events', () => {
      component.ngOnDestroy();

      expect(component['newMessageSubscription'].closed).toBe(true);
    });

    it('should set currentConversation to null', () => {
      component.ngOnDestroy();

      expect(component.currentConversation).toBe(null);
    });
  });

  describe('describe dateIsThisYear', () => {
    it('should return TRUE when the date is in the current calendar year', () => {
      const expectedResult = component.dateIsThisYear(new Date());

      expect(expectedResult).toBe(true);
    });

    it('should return FALSE when the date is NOT in the current calendar year', () => {
      const expectedResult = component.dateIsThisYear(new Date('1986/05/08'));

      expect(expectedResult).toBe(false);
    });
  });

  describe('showDate', () => {
    let currentMessage;
    let nextMessage;
    beforeEach(() => {
      currentMessage = component.currentConversation.messages[0];
      nextMessage = new InboxMessage(
        '123',
        component.currentConversation.id,
        'new msg',
        USER_ID,
        true,
        new Date(),
        MessageStatus.RECEIVED,
        MessageType.TEXT
      );
    });

    it('should return TRUE if it is called without a nextMessage parameter', () => {
      const value = component.showDate(component.currentConversation.messages[0], null);

      expect(value).toBe(true);
    });

    it('should return FALSE if called with a currentMessage and nextMessage that have the same date (same day)', () => {
      const nextMessageDate = new Date(currentMessage.date);
      nextMessageDate.setTime(nextMessageDate.getTime() + 1 * 60 * 60 * 1000); // adds 1 hour
      nextMessage.date = nextMessageDate;

      const value = component.showDate(currentMessage, nextMessage);

      expect(value).toBe(false);
    });

    it('should return TRUE if called with a currentMessage and nextMessage that have the different dates (not same day)', () => {
      const nextMessageDate = new Date(currentMessage.date);
      nextMessageDate.setDate(nextMessageDate.getDate() + 1); // adds 1 day
      nextMessage.date = nextMessageDate;

      const value = component.showDate(currentMessage, nextMessage);

      expect(value).toBe(true);
    });
  });

  describe('hasMoreMessages', () => {
    it('should return TRUE if currentConversation has nextPageToken', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.nextPageToken = 'someToken';

      const result = component.hasMoreMessages();

      expect(result).toBeTruthy();
    });

    it('should return FALSE if currentConversation has not nextPageToken', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.nextPageToken = null;

      const result = component.hasMoreMessages();

      expect(result).toBeFalsy();
    });
  });

  describe('loadMoreMessages', () => {
    it('should call conversationService to loadMoreMessages() if isLoadingMore is FALSE', () => {
      spyOn(conversationService, 'loadMoreMessages').and.callThrough();
      component['isLoadingMoreMessages'] = false;

      component.loadMoreMessages();

      expect(conversationService.loadMoreMessages).toHaveBeenCalled();
    });

    it('should NOT call conversationService to loadMoreMessages() if isLoadingMore is FALSE', () => {
      spyOn(conversationService, 'loadMoreMessages').and.callThrough();
      component['isLoadingMoreMessages'] = true;

      component.loadMoreMessages();

      expect(conversationService.loadMoreMessages).not.toHaveBeenCalled();
    });
  });

  describe('messagesVisibility', () => {
    it('should show text message', () => {
      expect(component.isTextMessage(MessageType.TEXT)).toBeTruthy();
    });

    it('should not show text message', () => {
      expect(component.isTextMessage(null)).toBeFalsy();
      expect(component.isTextMessage(MessageType.REVIEW)).toBeFalsy();
      expect(component.isTextMessage(MessageType.PRICE_DROP)).toBeFalsy();
    });

    it('should show message third voice', () => {
      expect(component.isThirdVoiceReview(MessageType.REVIEW)).toBeTruthy();
      expect(component.isThirdVoiceDropPrice(MessageType.PRICE_DROP)).toBeTruthy();
    });

    it('should not show message third voice', () => {
      expect(component.isThirdVoiceDropPrice(null)).toBeFalsy();
      expect(component.isThirdVoiceDropPrice(MessageType.TEXT)).toBeFalsy();
      expect(component.isThirdVoiceReview(null)).toBeFalsy();
      expect(component.isThirdVoiceReview(MessageType.TEXT)).toBeFalsy();
    });
  });

  describe('scrollMessages', () => {
    it('should not scroll to last message', () => {
      spyOn(document, 'querySelector').and.returnValues(null);
      spyOn(component, 'sendReadForLastInboxMessage');

      component.scrollToLastMessage();

      expect(document.querySelector).toHaveBeenCalledWith('.message-body');
      expect(component.sendReadForLastInboxMessage).not.toHaveBeenCalled();
    });

    it('should scroll to last message', () => {
      const messageHTMLMock = { scrollIntoView: () => {} };
      spyOn(document, 'querySelector').and.returnValues(messageHTMLMock);
      spyOn(component, 'sendReadForLastInboxMessage');

      component.scrollToLastMessage();

      expect(document.querySelector).toHaveBeenCalledWith('.message-body');
      expect(component.sendReadForLastInboxMessage).toHaveBeenCalled();
      expect(component['isEndOfConversation']).toEqual(true);
    });
  });

  describe('sendReadSignal', () => {
    it('should not scroll to last message', () => {
      component['lastInboxMessage'] = null;
      spyOn(realTime, 'sendRead');

      component.sendReadForLastInboxMessage();

      expect(realTime.sendRead).not.toHaveBeenCalled();
    });

    it('should scroll to last message', fakeAsync(() => {
      spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());

      const inboxMessage = new InboxMessage(
        '123',
        component.currentConversation.id,
        'new msg',
        USER_ID,
        false,
        new Date(),
        MessageStatus.RECEIVED,
        MessageType.TEXT
      );
      component['lastInboxMessage'] = inboxMessage;
      spyOn(realTime, 'sendRead');

      component.sendReadForLastInboxMessage();
      tick(1000);

      expect(realTime.sendRead).toHaveBeenCalledWith(inboxMessage.from, inboxMessage.thread);
    }));
  });

  describe('navigationBack', () => {
    it('should set the current conversation as null', () => {
      spyOn(eventService, 'emit');
      component.ngOnInit();
      component.currentConversation = MOCK_CONVERSATION();

      component.navigationBack();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CURRENT_CONVERSATION_SET, null);
    });
  });

  describe('clickSendMessage', () => {
    const MESSAGE_ID = 'MESSAGE_ID';
    const message = new InboxMessage(
      MESSAGE_ID,
      'message_thread',
      'text',
      'user_id',
      true,
      new Date(),
      MessageStatus.PENDING,
      MessageType.TEXT
    );

    beforeEach(() => spyOn(remoteConsoleService, 'sendMessageAckFailed'));

    it('should send message is not send for pending messages', fakeAsync(() => {
      component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
      component.currentConversation.messages = [message];

      component.clickSendMessage(MESSAGE_ID);

      tick(component.MESSAGE_METRIC_DELAY);

      expect(remoteConsoleService.sendMessageAckFailed).toHaveBeenCalledWith(MESSAGE_ID, 'message is not send after 5000ms');
    }));

    describe('if there is no conversation selected', () => {
      it('should not send message', fakeAsync(() => {
        component.currentConversation = null;

        component.clickSendMessage(MESSAGE_ID);
        tick(component.MESSAGE_METRIC_DELAY);

        expect(remoteConsoleService.sendMessageAckFailed).not.toHaveBeenCalledWith();
      }));
    });
  });

  describe('restoreConnection', () => {
    beforeEach(() => {
      spyOn(remoteConsoleService, 'sendMessageAckFailed');
      component.ngOnInit();
    });

    it('should send metric message is not sent after restoring metric', () => {
      const MESSAGE_ID = 'MESSAGE_ID';
      const message = new InboxMessage(
        MESSAGE_ID,
        'message_thread',
        'text',
        'user_id',
        true,
        new Date(),
        MessageStatus.PENDING,
        MessageType.TEXT
      );
      component.currentConversation.messages = [message];

      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(remoteConsoleService.sendMessageAckFailed).toHaveBeenCalledWith(MESSAGE_ID, 'pending messages after restored connection');
    });
  });

  describe('when opening a different conversation', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
      component.currentConversation = null;
      fixture.detectChanges();
    });

    describe('and when other user is considered malicious', () => {
      beforeEach(() => {
        component.currentConversation = MOCK_INBOX_CONVERSATION_WITH_MALICIOUS_USER;
        component.ngOnChanges({
          currentConversation: new SimpleChange(null, MOCK_INBOX_CONVERSATION_WITH_MALICIOUS_USER, false),
        });

        fixture.detectChanges();
      });
      it('should show malicious modal', () => {
        // TODO: Investigate more why fixture.detectChanges is not triggering component.ngOnChanges automatically
        expect(modalService.open).toHaveBeenCalledWith(MaliciousConversationModalComponent, {
          windowClass: 'warning',
        });
      });

      it('should show red chat bubble with text indicates user is banned', () => {
        const bannedChatBubbleElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('#userIsBlocked');

        expect(bannedChatBubbleElement).toBeTruthy();
      });
    });

    describe('when user is not considered malicious but unsubscribed to wallapop', () => {
      beforeEach(() => {
        component.currentConversation = MOCK_INBOX_CONVERSATION_WITH_UNSUBSCRIBED_USER;
        component.ngOnChanges({
          currentConversation: new SimpleChange(null, MOCK_INBOX_CONVERSATION_WITH_UNSUBSCRIBED_USER, false),
        });
        fixture.detectChanges();
      });

      it('should not show malicious modal', () => {
        expect(modalService.open).not.toHaveBeenCalled();
      });

      it('should show blue chat bubble with text indicates user is unsubscribed', () => {
        const bannedChatBubbleElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('#userIsNotAvailableWarning');

        expect(bannedChatBubbleElement).toBeTruthy();
      });
    });

    describe('and when other user is not considered malicious', () => {
      it('should not show malicious modal', () => {
        // TODO: Investigate more why fixture.detectChanges is not triggering component.ngOnChanges automatically
        component.currentConversation = MOCK_INBOX_CONVERSATION_BASIC;
        component.ngOnChanges({
          currentConversation: new SimpleChange(null, MOCK_INBOX_CONVERSATION_BASIC, false),
        });
        fixture.detectChanges();

        expect(modalService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('Analytics', () => {
    describe('when malicious modal is shown', () => {
      let mockedAtr: ViewBannedUserChatPopUp;

      beforeEach(fakeAsync(() => {
        component.currentConversation = MOCK_INBOX_CONVERSATION_WITH_MALICIOUS_USER;
        mockedAtr = {
          userId: userService.user.id,
          bannedUserId: component.currentConversation?.user?.id,
          conversationId: component.currentConversation?.id,
          screenId: SCREEN_IDS.BannedUserChatPopUp,
        };
        spyOn(analyticsService, 'trackEvent').and.callThrough();
      }));

      describe('and when user clicks on CTA', () => {
        it('should track event to analytics', fakeAsync(() => {
          const expectedEvent: AnalyticsEvent<ClickBannedUserChatPopUpExitButton> = {
            name: ANALYTICS_EVENT_NAMES.ClickBannedUserChatPopUpExitButton,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: mockedAtr,
          };
          spyOn(modalService, 'open').and.callThrough();

          fixture.detectChanges();
          component.ngOnChanges({
            currentConversation: new SimpleChange(null, MOCK_INBOX_CONVERSATION_BASIC, false),
          });
          tick();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        }));
      });

      describe('and when user dismisses the modal', () => {
        it('should track event to analytics', fakeAsync(() => {
          modalMockResult = Promise.reject({});
          const expectedEvent: AnalyticsEvent<ClickBannedUserChatPopUpCloseButton> = {
            name: ANALYTICS_EVENT_NAMES.ClickBannedUserChatPopUpCloseButton,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: mockedAtr,
          };
          spyOn(modalService, 'open').and.callThrough();

          fixture.detectChanges();
          component.ngOnChanges({
            currentConversation: new SimpleChange(null, MOCK_INBOX_CONVERSATION_BASIC, false),
          });
          tick();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        }));
      });
    });
  });
});
