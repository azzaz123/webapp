import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { MOCK_ITEM_V3 } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { ConnectionService } from '@core/connection/connection.service';
import { CallsService } from '@core/conversation/calls.service';
import { DesktopNotificationsService } from '@core/desktop-notifications/desktop-notifications.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { RealTimeService } from '@core/message/real-time.service';
import { PaymentService } from '@core/payments/payment.service';
import { StripeService } from '@core/stripe/stripe.service';
import { UserService } from '@core/user/user.service';
import { UuidService } from '@core/uuid/uuid.service';

import * as moment from 'moment';
import { PrivateComponent } from './private.component';
import { ToastService } from '@layout/toast/core/services/toast.service';

jest.mock('moment');

let fixture: ComponentFixture<PrivateComponent>;
let component: any;
let de: DebugElement;
let userService: UserService;
let eventService: EventService;
let realTime: RealTimeService;
let inboxService: InboxService;
let desktopNotificationsService: DesktopNotificationsService;
let titleService: Title;
let callsService: CallsService;
let cookieService: CookieService;
let connectionService: ConnectionService;
let paymentService: PaymentService;
let stripeService: StripeService;
let uuidService: UuidService;

const ACCESS_TOKEN = 'accesstoken';

describe('PrivateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PrivateComponent],
      providers: [
        EventService,
        ToastService,
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
            user: MOCK_USER,
            initializeUserWithPermissions() {},
            checkUserStatus() {},
            logout() {},
            setPermission() {},
            sendUserPresenceInterval() {},
            isProfessional() {
              return of(false);
            },
          },
        },
        { provide: LOCALE_ID, useValue: 'en' },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(PrivateComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    realTime = TestBed.inject(RealTimeService);
    inboxService = TestBed.inject(InboxService);
    desktopNotificationsService = TestBed.inject(DesktopNotificationsService);
    titleService = TestBed.inject(Title);
    callsService = TestBed.inject(CallsService);
    cookieService = TestBed.inject(CookieService);
    connectionService = TestBed.inject(ConnectionService);
    paymentService = TestBed.inject(PaymentService);
    stripeService = TestBed.inject(StripeService);
    uuidService = TestBed.inject(UuidService);

    spyOn(desktopNotificationsService, 'init');
    spyOn(window.location, 'reload');
  });

  it(
    'should create the app',
    waitForAsync(() => {
      const app: PrivateComponent = fixture.debugElement.componentInstance;
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

      expect(cookieService.put).toHaveBeenCalledWith('app_session_id', uuidService.getUUID(), cookieOptions);
    });
  });

  describe('subscribeEvents', () => {
    function getEventServiceSubscribeArgs() {
      const eventServiceSubscribeArgs = [];
      eventService.subscribe['calls'].allArgs().map((call) => eventServiceSubscribeArgs.push(call[0]));
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
        spyOn(cookieService, 'get').and.returnValue(null);

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(cookieService.get).toHaveBeenCalledWith('app_session_id');
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

  describe('setTitle', () => {
    it('should set title', () => {
      spyOn(titleService, 'setTitle');
      component['setTitle']();

      expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
    });
  });

  describe('Stripe', () => {
    it('should call initialize Stripe library', () => {
      spyOn(stripeService, 'init');
      component.ngOnInit();
      expect(stripeService.init).toHaveBeenCalledTimes(1);
    });
  });
});
