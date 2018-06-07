/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { HaversineService } from 'ng2-haversine';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import { ConversationService } from './core/conversation/conversation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import createSpy = jasmine.createSpy;
import { CookieService } from 'ngx-cookie';
import { UUID } from 'angular2-uuid';
import { TrackingService } from './core/tracking/tracking.service';
import { MatIconRegistry } from '@angular/material';
import { MessageService } from './core/message/message.service';
import { NotificationService } from './core/notification/notification.service';
import { XmppService } from './core/xmpp/xmpp.service';
import { EventService } from './core/event/event.service';
import { ErrorsService } from './core/errors/errors.service';
import { UserService } from './core/user/user.service';
import { DebugService } from './core/debug/debug.service';
import { MOCK_USER, MOCK_USER_PRO, USER_DATA, USER_ID } from '../tests/user.fixtures.spec';
import { I18nService } from './core/i18n/i18n.service';
import { MockTrackingService } from '../tests/tracking.fixtures.spec';
import { WindowRef } from './core/window/window.service';
import { TEST_HTTP_PROVIDERS } from '../tests/utils.spec';
import { User } from './core/user/user';
import { ConnectionService } from './core/connection/connection.service';
import { CallsService } from './core/conversation/calls.service';
import { and } from '@angular/router/src/utils/collection';
import { MOCK_ITEM_V3 } from '../tests/item.fixtures.spec';

let fixture: ComponentFixture<AppComponent>;
let component: any;
let userService: UserService;
let errorsService: ErrorsService;
let eventService: EventService;
let xmppService: XmppService;
let notificationService: NotificationService;
let messageService: MessageService;
let titleService: Title;
let trackingService: TrackingService;
let window: any;
let conversationService: ConversationService;
let callsService: CallsService;
let cookieService: CookieService;
let connectionService: ConnectionService;

const EVENT_CALLBACK: Function = createSpy('EVENT_CALLBACK');
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
        {provide: DebugService, useValue: {}},
        {
          provide: ConnectionService, useValue: {
          checkConnection() {}
        }
        },
        {
          provide: XmppService, useValue: {
          connect() {
          },
          disconnect() {
          }
        }
        },
        ErrorsService,
        MockBackend,
        {
          provide: UserService, useValue: {
          checkUserStatus() {
          },
          me() {
            return Observable.of(MOCK_USER);
          },
          logout() {
          },
          setPermission() {},
          isProfessional() {
            return Observable.of(false);
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
            return Observable.of();
          },
          handleNewMessages() {
          },
          resetCache() {},
          syncItem() {}
        }
        },
        {
          provide: CallsService, useValue: {
            init() {
              return Observable.of();
            },
          syncItem() {}
          }
        },
        {
          provide: Router, useValue: {
          events: Observable.of(new NavigationEnd(1, 'test', 'test'))
        }
        },
        {
          provide: ActivatedRoute, useValue: {
          outlet: 'primary',
          data: Observable.of({
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
        ...
          TEST_HTTP_PROVIDERS
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    ;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    eventService = TestBed.get(EventService);
    xmppService = TestBed.get(XmppService);
    notificationService = TestBed.get(NotificationService);
    messageService = TestBed.get(MessageService);
    titleService = TestBed.get(Title);
    trackingService = TestBed.get(TrackingService);
    window = TestBed.get(WindowRef).nativeWindow;
    conversationService = TestBed.get(ConversationService);
    callsService = TestBed.get(CallsService);
    cookieService = TestBed.get(CookieService);
    connectionService = TestBed.get(ConnectionService);
    spyOn(notificationService, 'init');
  });

  it('should create the app', async(() => {
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('set cookie', () => {
    it('should create a cookie', () => {
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

    describe('success case', () => {

      beforeEach(fakeAsync(() => {
        const mockBackend: MockBackend = TestBed.get(MockBackend);
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
          connection.mockRespond(new Response(res));
        });
        spyOn(conversationService, 'init').and.returnValue(Observable.of({}));
        spyOn(callsService, 'init').and.returnValue(Observable.of({}));
      }));

      it('should call the eventService.subscribe passing the login event', () => {
        spyOn(eventService, 'subscribe').and.callThrough();

        component.ngOnInit();

        expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.USER_LOGIN);
      });

      it('should perform a xmpp connect when the login event is triggered with the correct user data', () => {
        spyOn(xmppService, 'connect').and.callThrough();

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(xmppService.connect).toHaveBeenCalledWith(USER_ID, ACCESS_TOKEN);
      });

      it('should call conversationService.init', () => {
        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(conversationService.init).toHaveBeenCalledTimes(1);
      });

      it('should call conversationService.init twice if user is professional', () => {
        spyOn(userService, 'isProfessional').and.returnValue(Observable.of(true));

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(conversationService.init).toHaveBeenCalledTimes(2);
      });

      it('should call checkConnection when the component initialises', () => {
        spyOn(connectionService, 'checkConnection');

        component.ngOnInit();

        expect(connectionService.checkConnection).toHaveBeenCalled();
      });

      it('should call callsService.init twice if user is professional', () => {
        spyOn(userService, 'isProfessional').and.returnValue(Observable.of(true));

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(callsService.init).toHaveBeenCalledTimes(2);
      });

      it('should call userService setpermission method', () => {
        spyOn(userService, 'setPermission').and.callThrough();

        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

        expect(userService.setPermission).toHaveBeenCalledWith(USER_DATA.type);
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

      it('should call the resetCache method in conversationService when a CLIENT_DISCONNECTED event is triggered', () => {
        spyOn(conversationService, 'resetCache');

        component.ngOnInit();
        eventService.emit(EventService.CLIENT_DISCONNECTED);

        expect(conversationService.resetCache).toHaveBeenCalledTimes(1);
      });

    });

    it('should logout the user and show the error if token is expired', fakeAsync(() => {
      const ERROR: any = {
        'code': 1,
        'type': 'error',
        'message': 'Token expired'
      };
      spyOn(userService, 'logout');
      spyOn(errorsService, 'show');
      spyOn(userService, 'me').and.returnValue(Observable.throw(ERROR));

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);

      expect(userService.logout).toHaveBeenCalled();
      expect(errorsService.show).toHaveBeenCalled();
    }));

    it('should init notifications', () => {
      component.ngOnInit();

      expect(notificationService.init).toHaveBeenCalled();
    });

    it('should call disconnect on logout', () => {
      spyOn(xmppService, 'disconnect');

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(xmppService.disconnect).toHaveBeenCalled();
    });

    it('should call syncItem on ITEM_UPDATED', () => {
      spyOn(conversationService, 'syncItem');
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_UPDATED, MOCK_ITEM_V3);

      expect(conversationService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
      expect(callsService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
    });

    it('should call syncItem on ITEM_SOLD', () => {
      spyOn(conversationService, 'syncItem');
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_SOLD, MOCK_ITEM_V3);

      expect(conversationService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
      expect(callsService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
    });

    it('should call syncItem on ITEM_RESERVED', () => {
      spyOn(conversationService, 'syncItem');
      spyOn(callsService, 'syncItem');

      component.ngOnInit();
      eventService.emit(EventService.ITEM_RESERVED, MOCK_ITEM_V3);

      expect(conversationService.syncItem).toHaveBeenCalledWith(MOCK_ITEM_V3);
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
});
