import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { InboxService } from '@features/chat/core/inbox/inbox.service';
import { MessageService } from '@features/chat/core/message/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { of, Subject, throwError } from 'rxjs';
import { MockAnalyticsService } from '../tests/analytics.fixtures.spec';
import { MOCK_ITEM_V3 } from '../tests/item.fixtures.spec';
import { MockTrackingService } from '../tests/tracking.fixtures.spec';
import { MOCK_USER, USER_ID } from '../tests/user.fixtures.spec';
import { AppComponent } from './app.component';
import { AnalyticsService } from './core/analytics/analytics.service';
import { ConnectionService } from './core/connection/connection.service';
import { CallsService } from './core/conversation/calls.service';
import { DesktopNotificationsService } from './core/desktop-notifications/desktop-notifications.service';
import { DidomiService } from './core/didomi/didomi.service';
import { ErrorsService } from './core/errors/errors.service';
import { EventService } from './core/event/event.service';
import { I18nService } from './core/i18n/i18n.service';
import { RealTimeService } from './core/message/real-time.service';
import { PaymentService } from './core/payments/payment.service';
import { StripeService } from './core/stripe/stripe.service';
import { TrackingService } from './core/tracking/tracking.service';
import { UserService } from './core/user/user.service';
import { UuidService } from './core/uuid/uuid.service';
import { SwUpdate } from '@angular/service-worker';
import * as moment from 'moment';
import { PATH_EVENTS } from './app-routing-constants';

jest.mock('moment');

let fixture: ComponentFixture<AppComponent>;
let component: any;
let de: DebugElement;
let el: HTMLElement;
let userService: UserService;
let errorsService: ErrorsService;
let eventService: EventService;
let realTime: RealTimeService;
let inboxService: InboxService;
let desktopNotificationsService: DesktopNotificationsService;
let messageService: MessageService;
let titleService: Title;
let trackingService: TrackingService;
let callsService: CallsService;
let cookieService: CookieService;
let connectionService: ConnectionService;
let paymentService: PaymentService;
let stripeService: StripeService;
let analyticsService: AnalyticsService;
let uuidService: UuidService;
let activatedRoute: ActivatedRoute;

const ACCESS_TOKEN = 'accesstoken';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        EventService,
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {},
              };
            },
          },
        },
        {
          provide: SwUpdate,
          useValue: {
            available: of(null),
            activated: of(null),
          },
        },
        {
          provide: InboxService,
          useValue: {
            init() {},
            saveInbox() {},
          },
        },
        {
          provide: ConnectionService,
          useValue: {
            checkConnection() {},
          },
        },
        {
          provide: RealTimeService,
          useValue: {
            connect() {},
            disconnect() {},
            reconnect() {},
          },
        },
        ErrorsService,
        {
          provide: UserService,
          useValue: {
            checkUserStatus() {},
            me() {
              return of(MOCK_USER);
            },
            logout() {},
            setPermission() {},
            sendUserPresenceInterval() {},
            isProfessional() {
              return of(false);
            },
          },
        },
        {
          provide: MessageService,
          useValue: {
            totalUnreadMessages$: new Subject(),
          },
        },
        I18nService,
        { provide: TrackingService, useClass: MockTrackingService },
        DesktopNotificationsService,
        {
          provide: CallsService,
          useValue: {
            init() {
              return of();
            },
            syncItem() {},
          },
        },
        {
          provide: Router,
          useValue: {
            events: of(new NavigationEnd(1, 'test', 'test')),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            outlet: 'primary',
            root: { firstChild: { snapshot: {} } },
            data: of({
              title: 'Chat',
              hideSidebar: true,
            }),
          },
        },
        {
          provide: CookieService,
          useValue: {
            value: null,
            put() {},
            get() {
              return this.value;
            },
          },
        },
        {
          provide: PaymentService,
          useValue: {
            deleteCache() {},
          },
        },
        {
          provide: StripeService,
          useValue: {
            init() {},
          },
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
    eventService = TestBed.inject(EventService);
    realTime = TestBed.inject(RealTimeService);
    inboxService = TestBed.inject(InboxService);
    desktopNotificationsService = TestBed.inject(DesktopNotificationsService);
    messageService = TestBed.inject(MessageService);
    titleService = TestBed.inject(Title);
    trackingService = TestBed.inject(TrackingService);
    callsService = TestBed.inject(CallsService);
    cookieService = TestBed.inject(CookieService);
    connectionService = TestBed.inject(ConnectionService);
    paymentService = TestBed.inject(PaymentService);
    stripeService = TestBed.inject(StripeService);
    analyticsService = TestBed.inject(AnalyticsService);
    uuidService = TestBed.inject(UuidService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(desktopNotificationsService, 'init');
    spyOn(window.location, 'reload');
  });

  it(
    'should create the app',
    waitForAsync(() => {
      const app: AppComponent = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );

  describe('when the app initializes', () => {
    beforeEach(() => component.ngOnInit());

    it('should set current app language to date library', () => {
      expect(moment.locale).toHaveBeenCalledWith('en');
    });
  });

  describe('set cookie', () => {
    it('should create a cookie', () => {
      spyOn(uuidService, 'getUUID').and.returnValue('1-2-3');
      spyOn(cookieService, 'put');
      spyOn(Date.prototype, 'getTime').and.returnValue(123456789);
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + 900000);
      const cookieOptions = { path: '/', expires: expirationDate };

      component.updateSessionCookie();

      expect(cookieService.put).toHaveBeenCalledWith(
        'app_session_id',
        uuidService.getUUID(),
        cookieOptions
      );
    });
  });

  describe('subscribeEvents', () => {
    function getEventServiceSubscribeArgs() {
      const eventServiceSubscribeArgs = [];
      eventService.subscribe['calls']
        .allArgs()
        .map((call) => eventServiceSubscribeArgs.push(call[0]));
      return eventServiceSubscribeArgs;
    }

    describe('success case', () => {
      function emitSuccessChatEvents() {
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
        eventService.emit(EventService.CHAT_RT_CONNECTED);
      }
      beforeEach(fakeAsync(() => {
        spyOn(callsService, 'init').and.returnValue(of({}));
        spyOn(inboxService, 'init');
      }));

      it('should call the eventService.subscribe passing the login event', () => {
        spyOn(eventService, 'subscribe').and.callThrough();

        component.ngOnInit();
        const eventServiceCalls = getEventServiceSubscribeArgs();

        expect(eventServiceCalls).toContain(EventService.USER_LOGIN);
      });

      it('should perform a xmpp connect when the login event is triggered with the correct user data', () => {
        spyOn(realTime, 'connect');

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

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
        spyOn(userService, 'isProfessional').and.returnValue(of(true));

        component.ngOnInit();
        emitSuccessChatEvents();

        expect(callsService.init).toHaveBeenCalledTimes(2);
      });

      it('should call inboxService.init', () => {
        component.ngOnInit();
        emitSuccessChatEvents();

        expect(inboxService.init).toHaveBeenCalledTimes(1);
      });

      it('should send open_app event if cookie does not exist', () => {
        spyOn(trackingService, 'track');
        spyOn(cookieService, 'get').and.returnValue(null);

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(cookieService.get).toHaveBeenCalledWith('app_session_id');
        expect(trackingService.track).toHaveBeenCalledWith(
          TrackingService.APP_OPEN,
          {
            referer_url: component.previousUrl,
            current_url: component.currentUrl,
          }
        );
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
          },
        });

        component.ngOnInit();
        eventService.emit(EventService.CHAT_RT_DISCONNECTED);

        expect(realTime.reconnect).toHaveBeenCalled();
      });
    });

    it('should NOT call userService.sendUserPresenceInterval is the user has not successfully logged in', () => {
      spyOn(userService, 'me').and.returnValue(throwError({}));
      spyOn(errorsService, 'show');
      spyOn(userService, 'sendUserPresenceInterval');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

      expect(userService.sendUserPresenceInterval).not.toHaveBeenCalled();
    });

    it('should init notifications', () => {
      component.ngOnInit();

      expect(desktopNotificationsService.init).toHaveBeenCalled();
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

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.MY_PROFILE_LOGGED_OUT
      );
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

  describe('When current route data changes', () => {
    beforeEach(() => {
      activatedRoute.root.firstChild.snapshot.data = {};
    });

    it('should update sidebar status with the route specification', () => {
      const hideSidebarValue = false;
      activatedRoute.root.firstChild.snapshot.data[
        PATH_EVENTS.hideSidebar
      ] = hideSidebarValue;

      component.ngOnInit();

      expect(component.hideSidebar).toEqual(hideSidebarValue);
    });
  });

  describe('When sidebar hide/show status changes', () => {
    const sidebarSelector = 'tsl-sidebar';

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not have sidebar by default', () => {
      expect(el.querySelector(sidebarSelector)).toBeFalsy();
    });

    it('should have sidebar if show', () => {
      component.hideSidebar = false;

      fixture.detectChanges();

      expect(el.querySelector(sidebarSelector)).toBeTruthy();
    });

    it('should not have sidebar if hidden', () => {
      component.hideSidebar = true;

      fixture.detectChanges();

      expect(el.querySelector(sidebarSelector)).toBeFalsy();
    });
  });
});
