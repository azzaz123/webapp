/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { ConversationsPanelComponent } from './conversations-panel.component';
import {
  UserService, EventService, ItemService, TEST_HTTP_PROVIDERS, Message, MOCK_MESSAGE, XmppService, MessageService,
  PersistencyService, USER_ID, User, NotificationService, MockedPersistencyService, I18nService, HttpService,
  ConversationService, TrackingService, MockTrackingService, createConversationsArray, MOCK_CONVERSATION,
  SECOND_MOCK_CONVERSATION } from 'shield';
import { ConversationComponent } from '../../core/conversation/conversation/conversation.component';
import { Conversation } from '../../core/conversation/conversation';
import { Observable } from 'rxjs/Observable';

import { HaversineService } from 'ng2-haversine';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  let elRef: ElementRef

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule
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
    spyOn(service, 'loadNotStoredMessages').and.callFake((param) => {
      return Observable.of(param);
    });

  });

  describe('getConversations', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    describe('if data is present', () => {
      beforeEach(() => {
        spyOn(component, 'setCurrentConversationFromQueryParams');
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
        it('should track the ConversationListActive if the archive is set to false', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
        });
        it('should track the ConversationListActive if the archive is set to true', () => {
          component.archive = true;
          component['getConversations']();
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_PROCESSED_LOADED);
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
      it('should call getPage with expectedVisit', () => {
        component['page'] = 2;
        component['archive'] = true;
        component.filter = 'meetings';
        spyOn(service, 'getPage').and.callThrough();
        component['getConversations']();
        expect(service.getPage).toHaveBeenCalledWith(2, true, [
          {key: 'phone', value: undefined},
          {key: 'expectedVisit', value: true}]);
      });
      it('should call getPage with others filter', () => {
        component['page'] = 2;
        component['archive'] = true;
        component.filter = 'others';
        spyOn(service, 'getPage').and.callThrough();
        component['getConversations']();
        expect(service.getPage).toHaveBeenCalledWith(2, true, [
          {key: 'phone', value: undefined},
          {key: 'expectedVisit', value: false}]);
      });
    });
    describe('if data is not present', () => {
      beforeEach(() => {
        spyOn(component, 'setCurrentConversationFromQueryParams');
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
      component.loadMore();
    })
    it('should increment page', () => {
      expect(component['page']).toBe(2);
    });
    it('should call getConversations', () => {
      spyOn(component, 'getConversations');
      component.loadMore();
      expect(component['getConversations']).toHaveBeenCalled();
    });
  });

  describe('setCurrentConversationFromQueryParams', () => {

    const CONVERSATIONS: Conversation[] = createConversationsArray(4);

    describe('no archive', () => {
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

      it('should call load more for every page needed', () => {
        spyOn(service, 'getConversationPage').and.returnValue(3);
        spyOn(component, 'loadMore');
        route.queryParams = Observable.of({
          c: '1'
        });
        component['setCurrentConversationFromQueryParams']();
        expect(component.loadMore).toHaveBeenCalledTimes(2);
      });
    });

    describe('archive', () => {
      beforeEach(() => {
        component.conversations = CONVERSATIONS;
        service.archivedLeads = CONVERSATIONS;
      });

      it('should set the current conversation from query params', () => {
        route.queryParams = Observable.of({
          c: '1',
          archive: 'true'
        });
        component['setCurrentConversationFromQueryParams']();
        expect(component['conversation'].id).toBe('1');
      });

      it('should NOT set the current conversation if conversation is NOT found', () => {
        route.queryParams = Observable.of({
          c: 'a',
          archive: 'true'
        });
        component['setCurrentConversationFromQueryParams']();
        expect(component['conversation']).toBeUndefined();
      });

      it('should call load more for every page needed', () => {
        spyOn(service, 'getConversationPage').and.returnValue(3);
        spyOn(component, 'loadMore');
        route.queryParams = Observable.of({
          c: '1',
          archive: 'true'
        });
        component['setCurrentConversationFromQueryParams']();
        expect(component.loadMore).toHaveBeenCalledTimes(2);
      });
    });


  });

  describe('setCurrentConversation', () => {

    it('should set the current conversation', () => {
      let ret: Conversation;
      component.currentConversation.subscribe((c: Conversation) => {
        ret = c;
      });
      let conversation: Conversation = MOCK_CONVERSATION();
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

  describe('handleArchiveConversations', () => {
    it('should call setCurrentConversation', () => {
      spyOn(component, 'setCurrentConversation');
      component['handleArchiveConversations']();
      eventService.emit(EventService.CONVERSATION_ARCHIVED, MOCK_CONVERSATION());
      expect(component.setCurrentConversation).toHaveBeenCalled();
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
      spyOn(component, 'getConversations');
      spyOn(component, 'handleArchiveConversations');
    });
    it('should set filter', () => {
      route.queryParams = Observable.of({
        filterBy: 'test'
      });
      component.ngOnInit();
      expect(component.filter).toBe('test');
    });
    it('should call getConversations & handleDeleteConversations', () => {
      component.ngOnInit();
      expect(component['getConversations']).toHaveBeenCalled();
      expect(component['handleArchiveConversations']).toHaveBeenCalled();
    });
    it('should call sendRead on MESSAGE_ADDED event', () => {
      spyOn(component, 'sendRead');
      component.ngOnInit();
      eventService.emit(EventService.MESSAGE_ADDED, MOCK_MESSAGE);
      expect(component['sendRead']).toHaveBeenCalledWith(MOCK_MESSAGE);
    });
    it('should reload new conversations if conversation is unarchived', () => {
      component.archive = true;
      component['page'] = 10;
      component.ngOnInit();
      eventService.emit(EventService.CONVERSATION_UNARCHIVED);
      expect(component.archive).toBeFalsy();
      expect(component['page']).toBe(1);
      expect(component['getConversations']).toHaveBeenCalledTimes(2);
    });
    it('should NOT reload new conversations if conversation is unarchived', () => {
      component.archive = false;
      component['page'] = 10;
      component.ngOnInit();
      eventService.emit(EventService.CONVERSATION_UNARCHIVED);
      expect(component['page']).toBe(10);
      expect(component['getConversations']).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRead', () => {
    beforeEach(() => {
      spyOn(service, 'sendRead');
      spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());
    });
    it('should send conversation read confirm if the conversation open is the current', fakeAsync(() => {
      component['conversation'] = MOCK_CONVERSATION();
      let message: Message = MOCK_MESSAGE;
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

  describe('filterByArchived', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track');
      spyOn(component, 'getConversations');
      component['page'] = 10;
    });
    it('should set archive true', () => {
      component.filterByArchived(true);
      expect(component.archive).toBeTruthy();
      expect(component['page']).toBe(1);
      expect(component['getConversations']).toHaveBeenCalled();
    });
    it('should set archive false', () => {
      component.filterByArchived(false);
      expect(component.archive).toBeFalsy();
      expect(component['page']).toBe(1);
      expect(component['getConversations']).toHaveBeenCalled();
    });
  });

});
