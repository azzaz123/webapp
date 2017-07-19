/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { ConversationsPanelComponent } from './conversations-panel.component';
import {
  Conversation,
  createConversationsArray,
  HttpService,
  I18nService,
  ItemService,
  Message,
  MessageService,
  MOCK_CONVERSATION,
  MOCK_ITEM,
  MOCK_MESSAGE,
  MOCK_USER,
  MockedPersistencyService,
  MockTrackingService,
  NEW_CONVERSATION_RESPONSE,
  NotificationService,
  PersistencyService,
  SECOND_MOCK_CONVERSATION,
  ShieldModule,
  TEST_HTTP_PROVIDERS,
  TrackingService,
  User,
  USER_ID,
  XmppService
} from 'shield';
import { ConversationComponent } from './conversation/conversation.component';
import { Observable } from 'rxjs/Observable';

import { HaversineService } from 'ng2-haversine';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ConversationService } from '../../core/conversation/conversation.service';
import { EventService } from 'app/core/event/event.service';
import { UserService } from '../../core/user/user.service';

describe('Component: ConversationsPanel', () => {

  let component: ConversationsPanelComponent;
  let service: ConversationService;
  let eventService: EventService;
  let userService: UserService;
  let messageService: MessageService;
  let notificationService: NotificationService;
  let route: ActivatedRoute;
  let http: HttpService;
  let trackingService: TrackingService;
  let elRef: ElementRef;
  let conversationService: ConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule,
        ShieldModule.forRoot({
          cacheAllConversations: false,
          environment: environment
        })
      ],
      declarations: [ConversationsPanelComponent, ConversationComponent],
      providers: [
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useClass: MockTrackingService},
        ...TEST_HTTP_PROVIDERS,
        ConversationService,
        PersistencyService,
        HaversineService,
        MessageService,
        EventService,
        UserService,
        ItemService,
        XmppService,
        I18nService,
        {
          provide: ElementRef, useValue: {
          nativeElement: {
            querySelector() {
              return {
                offsetTop: 20,
                offsetHeight: 10
              };
            }
          }
        }
        },
        {
          provide: NotificationService, useValue: {
          sendBrowserNotification() {
          }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
          queryParams: Observable.of({})
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.get(ConversationService);
    eventService = TestBed.get(EventService);
    http = TestBed.get(HttpService);
    component = TestBed.createComponent(ConversationsPanelComponent).componentInstance;
    userService = TestBed.get(UserService);
    userService['_user'] = new User(USER_ID);
    messageService = TestBed.get(MessageService);
    notificationService = TestBed.get(NotificationService);
    route = TestBed.get(ActivatedRoute);
    trackingService = TestBed.get(TrackingService);
    elRef = TestBed.get(ElementRef);
    conversationService = TestBed.get(ConversationService);
    spyOn(service, 'loadNotStoredMessages').and.callFake((param) => {
      return Observable.of(param);
    });

  });

  describe('getConversations', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    describe('if data is present', () => {
      beforeEach(() => {
        spyOn<any>(component, 'setCurrentConversationFromQueryParams');
      });
      describe('with no params', () => {
        beforeEach(() => {
          spyOn(trackingService, 'track');
          spyOn(service, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));
          component['getConversations']();
        });
        it('should set conversations', () => {
          expect(component.conversations).toEqual(CONVERSATIONS);
        });
        it('should track the ConversationListActive', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
        });
        it('should call setCurrentConversationFromQueryParams', () => {
          expect(component['setCurrentConversationFromQueryParams']).toHaveBeenCalled();
        });
      });
      it('should NOT call setCurrentConversationFromQueryParams if already called', () => {
        component['currentConversationSet'] = true;
        component['getConversations']();
        service.stream$.next(CONVERSATIONS);
        expect(component['setCurrentConversationFromQueryParams']).not.toHaveBeenCalled();
      });
      it('should replace conversations', () => {
        component.conversations = CONVERSATIONS;
        component['getConversations']();
        service.stream$.next(CONVERSATIONS);
        expect(component.conversations).toEqual(CONVERSATIONS);
      });
    });
    describe('if data is not present', () => {
      beforeEach(() => {
        spyOn<any>(component, 'setCurrentConversationFromQueryParams');
        component['getConversations']();
        service.stream$.next([]);
      });
      it('should NOT set conversations', () => {
        expect(component.conversations.length).toBe(0);
      });
      it('should NOT call setCurrentConversationFromQueryParams', () => {
        expect(component['setCurrentConversationFromQueryParams']).not.toHaveBeenCalled();
      });
    });
  });

  describe('scrollToActive', () => {
    beforeEach(() => {
      component.scrollPanel = {
        nativeElement: {
          scrollTop: 0
        }
      };
    });
    it('should set scrollTop', () => {
      component['elRef'] = {
        nativeElement: {
          querySelector() {
            return {
              offsetTop: 30,
              offsetHeight: 20
            };
          }
        }
      };
      component['scrollToActive']();
      expect(component.scrollPanel.nativeElement.scrollTop).toBe(10);
    });
    it('should not set scrollTop', () => {
      component['elRef'] = {
        nativeElement: {
          querySelector() {
            return null;
          }
        }
      };
      component['scrollToActive']();
      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });

  describe('loadMore', () => {
    beforeEach(() => {
      component['page'] = 1;
      spyOn<any>(component, 'getConversations');
      spyOn(conversationService, 'loadMore').and.returnValue(Observable.of({}));
      component.loadMore();
    });
    it('should increment page', () => {
      expect(component['page']).toBe(2);
    });
    it('should call loadMore', () => {
      expect(conversationService.loadMore).toHaveBeenCalled();
    });
    it('should call getConversations', () => {
      expect(component['getConversations']).toHaveBeenCalled();
    });
  });

  describe('setCurrentConversationFromQueryParams', () => {

    const CONVERSATIONS: Conversation[] = createConversationsArray(4);

    beforeEach(() => {
      component.conversations = CONVERSATIONS;
      service.leads = CONVERSATIONS;
    });

    it('should set the current conversation from query params', () => {
      route.queryParams = Observable.of({
        c: '1'
      });
      component['setCurrentConversationFromQueryParams']();
      expect(component['conversation'].id).toBe('1');
    });

    it('should NOT set the current conversation if no query params', () => {
      component['setCurrentConversationFromQueryParams']();
      expect(component['conversation']).toBeUndefined();
    });

    it('should NOT set the current conversation if conversation is NOT found', () => {
      route.queryParams = Observable.of({
        c: 'a'
      });
      component['setCurrentConversationFromQueryParams']();
      expect(component['conversation']).toBeUndefined();
    });

  });

  describe('setCurrentConversation', () => {

    it('should set the current conversation', () => {
      let ret: Conversation;
      component.currentConversation.subscribe((c: Conversation) => {
        ret = c;
      });
      const conversation: Conversation = MOCK_CONVERSATION();
      component.setCurrentConversation(conversation);
      expect(ret).toEqual(conversation);
    });
  });

  describe('loaded event', () => {

    it('should emit loaded event true', () => {
      let ret: any;
      component.loaded.subscribe((event: any) => {
        ret = event;
      });
      component['conversations'] = createConversationsArray(3);
      component.loading = false;
      expect(ret.loaded).toBeTruthy();
      expect(ret.total).toBe(3);
    });

    it('should emit loaded event false', () => {
      let ret: any;
      component.loaded.subscribe((event: any) => {
        ret = event;
      });
      component.loading = true;
      expect(ret.loaded).toBeFalsy();
      expect(ret.total).toBe(0);
    });

  });

  describe('ngOnDestroy', () => {
    it('should call setCurrentConversation', () => {
      spyOn(component, 'setCurrentConversation');
      component.ngOnDestroy();
      expect(component.setCurrentConversation).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'getConversations');
    });
    it('should call getConversations', () => {
      component.ngOnInit();
      expect(component['getConversations']).toHaveBeenCalled();
    });
    it('should call sendRead on MESSAGE_ADDED event', () => {
      spyOn<any>(component, 'sendRead');
      component.ngOnInit();
      eventService.emit(EventService.MESSAGE_ADDED, MOCK_MESSAGE);
      expect(component['sendRead']).toHaveBeenCalledWith(MOCK_MESSAGE);
    });
    it('should call setCurrentConversation', () => {
      spyOn(component, 'setCurrentConversation');
      component.ngOnInit();
      eventService.emit(EventService.CONVERSATION_ARCHIVED, MOCK_CONVERSATION());
      expect(component.setCurrentConversation).toHaveBeenCalled();
    });
  });

  describe('sendRead', () => {
    beforeEach(() => {
      spyOn(service, 'sendRead');
      spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());
    });
    it('should send conversation read confirm if the conversation open is the current', fakeAsync(() => {
      component['conversation'] = MOCK_CONVERSATION();
      const message: Message = MOCK_MESSAGE;
      message.fromBuyer = true;
      component['sendRead'](message);
      tick(1000);
      expect(service.sendRead).toHaveBeenCalled();
    }));
    it('should NOT send conversation read confirm if the conversation open is NOT the current', fakeAsync(() => {
      component['conversation'] = SECOND_MOCK_CONVERSATION;
      component['sendRead'](MOCK_MESSAGE);
      tick(1000);
      expect(service.sendRead).not.toHaveBeenCalled();
    }));
  });
  describe('setCurrentConversationWithConversationId', () => {
    it('should call getConversationPage of conversationService', () => {
      spyOn(conversationService, 'getConversationPage');
      (component as any).setCurrentConversationWithConversationId(MOCK_CONVERSATION().id);
      expect(conversationService.getConversationPage).toHaveBeenCalledWith(MOCK_CONVERSATION().id);
    });
    it('if the page is found and it is higher than 1, it should create the conversation', () => {
      spyOn(conversationService, 'getConversationPage').and.returnValue(2);
      spyOn((component as any), 'createConversationAndSetItCurrent');
      (component as any).setCurrentConversationWithConversationId(MOCK_CONVERSATION().id);
      expect((component as any).createConversationAndSetItCurrent).toHaveBeenCalled();
    });
    it('if the page is found and it is the first, it should select the conversation', () => {
      spyOn(conversationService, 'getConversationPage').and.returnValue(1);
      component.conversations = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
      spyOn(component, 'setCurrentConversation');
      (component as any).setCurrentConversationWithConversationId(SECOND_MOCK_CONVERSATION.id);
      expect(component.setCurrentConversation).toHaveBeenCalledWith(SECOND_MOCK_CONVERSATION);
    });
  });
  describe('findConversation', () => {
    it('should call createConversationAndSetItCurrent if conversation is null', () => {
      spyOn((component as any), 'createConversationAndSetItCurrent');
      component.findConversation(null);
      expect((component as any).createConversationAndSetItCurrent).toHaveBeenCalled();
    });
    it('should call setCurrentConversationWithConversationId with the conversation Id if it exists', () => {
      spyOn((component as any), 'setCurrentConversationWithConversationId');
      component.findConversation(NEW_CONVERSATION_RESPONSE);
      expect((component as any).setCurrentConversationWithConversationId).toHaveBeenCalledWith(NEW_CONVERSATION_RESPONSE.conversation_id);
    });
  });

  describe('createConversationAndSetItCurrent', () => {
    beforeEach(() => {
      (component as any).newConversationItemId = 'newConversationItemId';
      spyOn(conversationService, 'addLead');
      spyOn(conversationService, 'createConversation').and.returnValue(Observable.of(NEW_CONVERSATION_RESPONSE));
    });
    it('should call createConversation of the service', () => {
      (component as any).createConversationAndSetItCurrent();
      expect(conversationService.createConversation).toHaveBeenCalledWith('newConversationItemId');
    });

    it('should get the user & item info, create a new conversation and add it to the existing list', () => {
      spyOn((component as any), 'getConversationUserAndItemInfo').and.returnValue(Observable.of([MOCK_USER, MOCK_ITEM]));
      spyOn(conversationService, 'loadMessagesIntoConversations');
      (component as any).createConversationAndSetItCurrent();
      expect((component as any).getConversationUserAndItemInfo).toHaveBeenCalled();
      expect((conversationService.addLead as any).calls.argsFor(0)[0]).toEqual(
        new Conversation(
          'conversation_id',
          null,
          123123,
          false,
          MOCK_USER,
          MOCK_ITEM)
      );
      expect(conversationService.loadMessagesIntoConversations).toHaveBeenCalledWith(component.conversations);
    });
  });
});

