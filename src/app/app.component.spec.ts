/* tslint:disable:no-unused-variable */


import {of as observableOf, throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HaversineService } from 'ng2-haversine';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConversationService } from './core/conversation/conversation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UUID } from 'angular2-uuid';
import { TrackingService } from './core/tracking/tracking.service';
import { MatIconRegistry } from '@angular/material';
import { MessageService } from './chat/service/message.service';
import { NotificationService } from './core/notification/notification.service';
import { EventService } from './core/event/event.service';
import { ErrorsService } from './core/errors/errors.service';
import { UserService } from './core/user/user.service';
import { MOCK_FULL_USER, MOCK_USER, USER_DATA, USER_ID } from '../tests/user.fixtures.spec';
import { I18nService } from './core/i18n/i18n.service';
import { MockTrackingService } from '../tests/tracking.fixtures.spec';
import { WindowRef } from './core/window/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from './core/connection/connection.service';
import { CallsService } from './core/conversation/calls.service';
import { MOCK_ITEM_V3 } from '../tests/item.fixtures.spec';
import { PaymentService } from './core/payments/payment.service';
import { RealTimeService } from './core/message/real-time.service';
import { InboxService } from './chat/service';
import { createInboxConversationsArray } from '../tests/inbox.fixtures.spec';
import { StripeService } from './core/stripe/stripe.service';
import { AnalyticsService } from './core/analytics/analytics.service';
import { MockAnalyticsService } from '../tests/analytics.fixtures.spec';

let fixture: ComponentFixture<AppComponent>;
let component: any;
let userService: UserService;
let errorsService: ErrorsService;
let eventService: EventService;
let realTime: RealTimeService;
let inboxService: InboxService;
let notificationService: NotificationService;
let messageService: MessageService;
let titleService: Title;
let trackingService: TrackingService;
let window: any;
let conversationService: ConversationService;
let callsService: CallsService;
let cookieService: CookieService;
let modalService: NgbModal;
let connectionService: ConnectionService;
let paymentService: PaymentService;
let stripeService: StripeService;
let analyticsService: AnalyticsService;

const ACCESS_TOKEN = 'accesstoken';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        EventService,
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {}
              };
            }
          }
        },
        {
          provide: InboxService, useValue: {
            init() {},
            saveInbox() {}
          }
        },
        {
          provide: ConnectionService, useValue: {
          checkConnection() {}
        }
        },
        {
          provide: RealTimeService, useValue: {
          connect() {},
          disconnect() {},
          reconnect() {}
          }
        },
        ErrorsService,
        {
          provide: UserService, useValue: {
          checkUserStatus() {
          },
          me() {
            return observableOf(MOCK_USER);
          },
          logout() {
          },
          sendUserPresenceInterval() {},
          isProfessional() {
            return observableOf(false);
          }
        }
        },
        HaversineService,
        {
          provide: MessageService, useValue: {
          totalUnreadMessages$: new Subject()
        }
        },
        I18nService,
        {
          provide: MatIconRegistry, useValue: {
          addSvgIcon() {
          },
          addSvgIconInNamespace() {
          },
          addSvgIconSetInNamespace() {
          }
        }
        },
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: NotificationService, useValue: {
          init() {
          }
        }
        },
        {
          provide: WindowRef, useValue: {
          nativeWindow: {
            location: {
              reload() {
              }
            }
          }
        }
        },
        {
          provide: ConversationService, useValue: {
          init() {
            return observableOf();
          },
          handleNewMessages() {},
          resetCache() {},
          syncItem() {},
          processChatSignal() {}
        }
        },
        {
          provide: CallsService, useValue: {
            init() {
              return observableOf();
            },
          syncItem() {}
          }
        },
        {
          provide: Router, useValue: {
          events: observableOf(new NavigationEnd(1, 'test', 'test'))
        }
        },
        {
          provide: ActivatedRoute, useValue: {
          outlet: 'primary',
          data: observableOf({
            title: 'Chat',
            hideSidebar: true
          })
        }
        },
        {
          provide: CookieService, useValue: {
          value: null,
            put() {
            },
            get () {
              return this.value;
            }
          }
        },
        {
          provide: PaymentService, useValue: {
            deleteCache() {
            }
        }
        },
        {
          provide: StripeService, useValue: {
            init() {}
          }
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    eventService = TestBed.get(EventService);
    realTime = TestBed.get(RealTimeService);
    inboxService = TestBed.get(InboxService);
    notificationService = TestBed.get(NotificationService);
    messageService = TestBed.get(MessageService);
    titleService = TestBed.get(Title);
    trackingService = TestBed.get(TrackingService);
    window = TestBed.get(WindowRef).nativeWindow;
    conversationService = TestBed.get(ConversationService);
    callsService = TestBed.get(CallsService);
    cookieService = TestBed.get(CookieService);
    modalService = TestBed.get(NgbModal);
    connectionService = TestBed.get(ConnectionService);
    paymentService = TestBed.get(PaymentService);
    stripeService = TestBed.get(StripeService);
    analyticsService = TestBed.get(AnalyticsService);
    spyOn(notificationService, 'init');
  });

  it('should create the app', async(() => {
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('set cookie', () => {
    it('should create a cookie', () => {
      jasmine.clock().uninstall();
      spyOn(UUID, 'UUID').and.returnValue('1-2-3');
      spyOn(cookieService, 'put');
      jasmine.clock().install();
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + ( 900000 ));
      jasmine.clock().mockDate(currentDate);
      const cookieOptions = {path: '/', expires: expirationDate};

      component.updateSessionCookie();

      expect(cookieService.put).toHaveBeenCalledWith('app_session_id', UUID.UUID() , cookieOptions);
      jasmine.clock().uninstall();
    });
  });

  describe('subscribeEvents', () => {
    function getEventServiceSubscribeArgs() {
      const eventServiceSubscribeArgs = [];
      eventService.subscribe['calls'].allArgs().map(call => eventServiceSubscribeArgs.push(call[0]));
      return eventServiceSubscribeArgs;
    }

    describe('success case', () => {
      function emitSuccessChatEvents() {
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
        eventService.emit(EventService.DB_READY);
        eventService.emit(EventService.CHAT_RT_CONNECTED);
      }
      beforeEach(fakeAsync(() => {
        spyOn(callsService, 'init').and.returnValue(observableOf({}));
        spyOn(inboxService, 'init');
      }));

      it('should call the eventService.subscribe passing the login event', () => {
        spyOn(eventService, 'subscribe').and.callThrough();

        component.ngOnInit();
        const eventServiceCalls = getEventServiceSubscribeArgs();

        expect(eventServiceCalls).toContain(EventService.USER_LOGIN);
      });

      it('should perform a xmpp connect when the login event and the DB_READY event are triggered with the correct user data', () => {
        spyOn(realTime, 'connect').and.callThrough();

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
        eventService.emit(EventService.DB_READY);

        expect(realTime.connect).toHaveBeenCalledWith(USER_ID, ACCESS_TOKEN);
      });

      it('should call userService.sendUserPresenceInterval', () => {
        spyOn(userService, 'sendUserPresenceInterval');

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(userService.sendUserPresenceInterval).toHaveBeenCalled();
      });

      it('should call checkConnection when the component initialises', () => {
        spyOn(connectionService, 'checkConnection');

        component.ngOnInit();

        expect(connectionService.checkConnection).toHaveBeenCalled();
      });

      it('should call callsService.init twice if user is professional', () => {
        spyOn(userService, 'isProfessional').and.returnValue(observableOf(true));

        component.ngOnInit();
        emitSuccessChatEvents();

        expect(callsService.init).toHaveBeenCalledTimes(2);
      });

      it('should call inboxService.init', () => {
        component.ngOnInit();
        emitSuccessChatEvents();

        expect(inboxService.init).toHaveBeenCalledTimes(1);
      });

      it('should NOT unsubscribe from the RT_CONNECTED_EVENT', () => {
        spyOn(userService, 'isProfessional').and.returnValue(observableOf(true));

        component.ngOnInit();
        emitSuccessChatEvents();

        expect(component['RTConnectedSubscription'].closed).toBe(false);
      });

      it('should send open_app event if cookie does not exist', () => {
        spyOn(trackingService, 'track');
        spyOn(cookieService, 'get').and.returnValue(null);

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(cookieService.get).toHaveBeenCalledWith('app_session_id');
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.APP_OPEN,
          { referer_url: component.previousUrl, current_url: component.currentUrl });
      });

      it('should call update session cookie if cookie does not exist', () => {
        spyOn(component, 'updateSessionCookie');
        spyOn(cookieService, 'get').and.returnValue(null);

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(cookieService.get).toHaveBeenCalledWith('app_session_id');
        expect(component.updateSessionCookie).toHaveBeenCalled();
      });

      it('should not call update session cookie if cookie exists', () => {
        spyOn(component, 'updateSessionCookie');
        spyOn(cookieService, 'get').and.returnValue('1-2-3');

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(cookieService.get).toHaveBeenCalledWith('app_session_id');
        expect(component.updateSessionCookie).not.toHaveBeenCalled();
      });

      it('should call realTime.reconnect when a CHAT_RT_DISCONNECTED event is triggered, if the user is logged in & has internet connection', () => {
        spyOn(realTime, 'reconnect');
        connectionService.isConnected = true;
        Object.defineProperty(userService, 'isLogged', {
          get() {
            return true;
          }
        });

        component.ngOnInit();
        eventService.emit(EventService.CHAT_RT_DISCONNECTED);

        expect(realTime.reconnect).toHaveBeenCalled();
      });
    });

    it('should NOT call userService.sendUserPresenceInterval is the user has not successfully logged in', () => {
      spyOn(userService, 'me').and.returnValue(observableThrowError({}));
      spyOn(errorsService, 'show');
      spyOn(userService, 'sendUserPresenceInterval');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

      expect(userService.sendUserPresenceInterval).not.toHaveBeenCalled();
    });

    it('should logout the user and show the error if token is expired', fakeAsync(() => {
      const ERROR: any = {
        'code': 1,
        'type': 'error',
        'message': 'Token expired'
      };
      spyOn(userService, 'logout');
      spyOn(errorsService, 'show');
      spyOn(userService, 'me').and.returnValue(observableThrowError(ERROR));

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

      expect(userService.logout).toHaveBeenCalled();
      expect(errorsService.show).toHaveBeenCalled();
    }));

    it('should init notifications', () => {
      component.ngOnInit();

      expect(notificationService.init).toHaveBeenCalled();
    });

    it('should call realTime.disconnect on logout', () => {
      spyOn(realTime, 'disconnect');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(realTime.disconnect).toHaveBeenCalled();
    });

    it('should delete payments cache', () => {
      spyOn(paymentService, 'deleteCache');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(paymentService.deleteCache).toHaveBeenCalled();
    });

    it('should call syncItem on ITEM_UPDATED', () => {
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_UPDATED, MOCK_ITEM_V3);

      expect(callsService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
    });

    it('should call syncItem on ITEM_SOLD', () => {
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_SOLD, MOCK_ITEM_V3);

      expect(callsService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
    });

    it('should call syncItem on ITEM_RESERVED', () => {
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_RESERVED, MOCK_ITEM_V3);

      expect(callsService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
    });
  });

  describe('config event tracking', () => {

    beforeEach(() => {
      spyOn(trackingService, 'track');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MY_PROFILE_LOGGED_OUT);
    });
  });

  describe('totalUnreadMessages$', () => {

    beforeEach(() => {
      spyOn(titleService, 'setTitle');
    });

    describe('with no messages', () => {
      beforeEach(() => {
        spyOn(titleService, 'getTitle').and.returnValue('Chat');
      });
      it('should update the title with unread messages when > 0', () => {
        component.ngOnInit();
        messageService.totalUnreadMessages$.next(100);

        expect(titleService.setTitle).toHaveBeenCalledWith('(100) Chat');
      });

      it('should update the title just with the title when unread messages are 0', () => {
        component.ngOnInit();
        messageService.totalUnreadMessages$.next(0);

        expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
      });
    });

    describe('with messages', () => {
      beforeEach(() => {
        spyOn(titleService, 'getTitle').and.returnValue('(10) Chat');
      });
      it('should update the title with unread messages when > 0', () => {
        component.ngOnInit();
        messageService.totalUnreadMessages$.next(100);

        expect(titleService.setTitle).toHaveBeenCalledWith('(100) Chat');
      });

      it('should update the title just with the title when unread messages are 0', () => {
        component.ngOnInit();
        messageService.totalUnreadMessages$.next(0);

        expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
      });
    });

  });

  describe('setTitle', () => {
    it('should set title', () => {
      spyOn(titleService, 'setTitle');
      component['setTitle']();

      expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
    });
    it('should set hideSidebar true', () => {
      component['setTitle']();

      expect(component.hideSidebar).toBeTruthy();
    });
  });

  describe('Stripe', () => {
    it('should call initialize Stripe library', () => {
      spyOn(stripeService, 'init');
      component.ngOnInit();
      expect(stripeService.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('Analytics', () => {
    it('should initialize the analytics library', () => {
      spyOn(analyticsService, 'initialize');

      component.ngOnInit();

      expect(analyticsService.initialize).toHaveBeenCalledTimes(1);
    });
  });

});
