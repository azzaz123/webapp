/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ConversationService,
  ErrorsService,
  EventService,
  I18nService,
  MessageService,
  MOCK_USER,
  MockTrackingService,
  NotificationService,
  TEST_HTTP_PROVIDERS,
  TrackingService,
  USER_DATA,
  USER_ID,
  UserService,
  WindowRef,
  XmppService
} from 'shield';
import { ToastrModule } from 'ngx-toastr';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { HaversineService } from 'ng2-haversine';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import createSpy = jasmine.createSpy;

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

const EVENT_CALLBACK: Function = createSpy('EVENT_CALLBACK');
const ACCESS_TOKEN = 'accesstoken';

describe('App: ProTool', () => {
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
          provide: MdIconRegistry, useValue: {
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
    spyOn(notificationService, 'init');
  });

  it('should create the app', async(() => {
    let app: AppComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('subscribeEvents', () => {

    describe('success case', () => {

      beforeEach(fakeAsync(() => {
        let mockBackend: MockBackend = TestBed.get(MockBackend);
        mockBackend.connections.subscribe((connection: MockConnection) => {
          let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
          connection.mockRespond(new Response(res));
        });
        spyOn(conversationService, 'init').and.returnValue(Observable.of({}));
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

      it('should track the MyProfileLoggedIn event', () => {
        spyOn(trackingService, 'track');
        component.ngOnInit();
        eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MY_PROFILE_LOGGED_IN, {user_id: USER_DATA.id});
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
  });

  describe('config event tracking', () => {

    beforeEach(() => {
      component.ngOnInit();
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

    it('should update the title with unread messages when > 0', () => {
      component.ngOnInit();
      messageService.totalUnreadMessages$.next(100);
      expect(titleService.setTitle).toHaveBeenCalledWith('(100) Wallapop Admin');
    });

    it('should update the title just with the title when unread messages are 0', () => {
      component.ngOnInit();
      messageService.totalUnreadMessages$.next(0);
      expect(titleService.setTitle).toHaveBeenCalledWith('Wallapop Admin');
    });

  });

});
