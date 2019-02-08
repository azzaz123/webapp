/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { InboxComponent } from './inbox.component';
import { InboxConversationComponent } from '../conversation/conversation.component';
import { Observable, Subscription } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from '../../core/conversation/conversation.service';
import { EventService } from '../../core/event/event.service';
import { UserService } from '../../core/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HttpService } from '../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { User } from '../../core/user/user';
import {
  createConversationsArray, MOCK_CONVERSATION, NEW_CONVERSATION_RESPONSE,
  SECOND_MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { Conversation } from '../../core/conversation/conversation';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { Message, phoneMethod } from '../../core/message/message';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MessageService } from '../../core/message/message.service';


describe('Component: ConversationsPanel', () => {

  let component: InboxComponent;
  let conversationService: ConversationService;
  let eventService: EventService;
  let userService: UserService;
  let route: ActivatedRoute;
  let http: HttpService;
  let trackingService: TrackingService;
  let messageService: MessageService;
  let elRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule,
        RouterTestingModule,
        NgxPermissionsModule,
        NgxPermissionsModule.forRoot()
      ],
      declarations: [InboxComponent, InboxConversationComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        ...TEST_HTTP_PROVIDERS,
        {
          provide: ConversationService, useValue: {
          stream$: new ReplaySubject(1),
          loadMore() {
            return Observable.of([]);
          },
          loadMoreArchived() {
            return Observable.of([]);
          },
          getPage() {
            return Observable.of([]);
          },
          getByItemId() {
            return Observable.of([]);
          },
          getConversationPage() {
          },
          createConversation() {
            return Observable.of([]);
          },
          getSingleConversationMessages() {
            return Observable.of([]);
          },
          addLead() {
          },
          sendRead() {
          },
          checkIfLastPage() {
            return Observable.of({});
          },
          markAs() {},
          markAllAsRead() {},
          loadNotStoredMessages() {},
          openPhonePopup() {}
        }
        },
        {provide: MessageService, useValue: {
          addPhoneNumberRequestMessage() {}
        }},
        EventService,
        {provide: UserService, useValue: {
          queryParams: {},
          isProfessional() {
            return Observable.of(true);
          }
        }},
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
          provide: ActivatedRoute, useValue: {
          queryParams: Observable.of({})
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    conversationService = TestBed.get(ConversationService);
    messageService = TestBed.get(MessageService);
    eventService = TestBed.get(EventService);
    http = TestBed.get(HttpService);
    component = TestBed.createComponent(InboxComponent).componentInstance;
    userService = TestBed.get(UserService);
    userService['_user'] = new User(USER_ID);
    route = TestBed.get(ActivatedRoute);
    trackingService = TestBed.get(TrackingService);
    elRef = TestBed.get(ElementRef);
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
          spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));
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

      it('should track the ConversationListProcessedLoaded if archive is true', () => {
        spyOn(trackingService, 'track');
        component.archive = true;

        component['getConversations']();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_PROCESSED_LOADED);
      });

      it('should NOT call setCurrentConversationFromQueryParams if already called', () => {
        component['currentConversationSet'] = true;
        spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));

        component['getConversations']();

        expect(component['setCurrentConversationFromQueryParams']).not.toHaveBeenCalled();
      });

      it('should emit a FIND_CONVERSATION event when currentConversationSet is not set and the params include an itemId', () => {
        spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));
        spyOn(conversationService, 'getByItemId').and.returnValue(Observable.of(NEW_CONVERSATION_RESPONSE));
        spyOn(eventService, 'emit');
        component['currentConversationSet'] = false;
        route.queryParams = Observable.of({
          itemId: '1'
        });

        component['getConversations']();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.FIND_CONVERSATION, NEW_CONVERSATION_RESPONSE);
      });

      it('should replace conversations', () => {
        component.conversations = CONVERSATIONS;
        spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));

        component['getConversations']();

        expect(component.conversations).toEqual(CONVERSATIONS);
      });
    });

    describe('if data is not present', () => {
      beforeEach(() => {
        spyOn<any>(component, 'setCurrentConversationFromQueryParams');

        component['getConversations']();
        conversationService.stream$.next([]);
      });

      it('should NOT set conversations', () => {
        expect(component.conversations.length).toBe(0);
      });

      it('should NOT call setCurrentConversationFromQueryParams', () => {
        expect(component['setCurrentConversationFromQueryParams']).not.toHaveBeenCalled();
      });
    });

    it('should call checkIfLastPage', () => {
      spyOn(conversationService, 'checkIfLastPage').and.callThrough();

      component['getConversations']();

      expect(conversationService.checkIfLastPage).toHaveBeenCalled();
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
      spyOn<any>(component, 'getConversations').and.callThrough();
      spyOn(conversationService, 'getPage').and.returnValue(Observable.of({}));
      spyOn(conversationService, 'loadMore').and.callThrough();
      spyOn(conversationService, 'loadMoreArchived').and.callThrough();
    });

    it('should increment pendingPagesLoaded each time loadMore is called, when archive is FALSE', () => {
      conversationService.pendingPagesLoaded = 0;
      component.archive = false;

      component.loadMore();

      expect(conversationService.pendingPagesLoaded).toBe(1);
    });

    it('should increment processedPagesLoaded each time loadMore is called, when archive is TRUE', () => {
      conversationService.processedPagesLoaded = 0;
      component.archive = true;

      component.loadMore();
      component.loadMore();

      expect(conversationService.processedPagesLoaded).toBe(2);
    });

    it('should call loadMore', () => {
      component.loadMore();

      expect(conversationService.loadMore).toHaveBeenCalled();
    });

    it('should call getConversations', () => {
      component.loadMore();

      expect(component['getConversations']).toHaveBeenCalled();
    });

    it('should call loadMoreArchived if archive', () => {
      component.archive = true;

      component.loadMore();

      expect(conversationService.loadMoreArchived).toHaveBeenCalled();
    });
  });

  describe('setCurrentConversationFromQueryParams', () => {

    const CONVERSATIONS: Conversation[] = createConversationsArray(4);

    beforeEach(() => {
      component.conversations = CONVERSATIONS;
      conversationService.leads = CONVERSATIONS;
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
      expect(ret.loaded).toBe(true);
      expect(ret.total).toBe(3);
    });

    it('should emit loaded event false', () => {
      let ret: any;
      component.loaded.subscribe((event: any) => {
        ret = event;
      });
      component.loading = true;
      expect(ret.loaded).toBe(false);
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
      spyOn(component, 'setCurrentConversation');
      spyOn(component, 'findConversation');
    });

    it('should call getConversations', () => {
      component.ngOnInit();

      expect(component['getConversations']).toHaveBeenCalled();
    });

    it('should subscribe to the PRIVACY_LIST_CHANGED event if a previous subscription does not exits', () => {
      spyOn(eventService, 'subscribe');
      const eventsSubscribed = [];

      component.ngOnInit();

      eventService.subscribe['calls'].allArgs().map(arg => eventsSubscribed.push(arg[0]));
      expect(eventsSubscribed).toContain(EventService.PRIVACY_LIST_UPDATED);
    });

    it('should NOT subscribe to the PRIVACY_LIST_CHANGED event if a previous subscription exits', () => {
      spyOn(eventService, 'subscribe');
      const eventsSubscribed = [];
      component['privacyListChangeSubscription'] = new Subscription;

      component.ngOnInit();

      eventService.subscribe['calls'].allArgs().map(arg => eventsSubscribed.push(arg[0]));
      expect(eventsSubscribed).not.toContain(EventService.PRIVACY_LIST_UPDATED);
    });

    it('should call sendRead on MESSAGE_ADDED event', () => {
      spyOn<any>(component, 'sendRead');
      component.ngOnInit();

      eventService.emit(EventService.MESSAGE_ADDED, MOCK_MESSAGE);

      expect(component['sendRead']).toHaveBeenCalledWith(MOCK_MESSAGE);
    });

    it('should call setCurrentConversation', () => {
      component.ngOnInit();

      eventService.emit(EventService.LEAD_ARCHIVED, MOCK_CONVERSATION());

      expect(component.setCurrentConversation).toHaveBeenCalled();
    });

    it('should call findConversation when a FIND_CONVERSATION event is emitted', () => {
      component.ngOnInit();

      eventService.emit(EventService.FIND_CONVERSATION, MOCK_CONVERSATION());

      expect(component.findConversation).toHaveBeenCalled();
    });

    it('should reload new conversations if conversation is unarchived', () => {
      component.archive = true;
      component.ngOnInit();

      eventService.emit(EventService.CONVERSATION_UNARCHIVED);

      expect(component.archive).toBe(false);
      expect(component['getConversations']).toHaveBeenCalledTimes(2);
      expect(component.setCurrentConversation).toHaveBeenCalled();
    });

    it('should call converstionService.loadNotStoredMessages when a CONNECTION_RESTORED event is trigered', () => {
      spyOn(conversationService, 'loadNotStoredMessages');

      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(conversationService.loadNotStoredMessages).toHaveBeenCalled();
    });

    it('should update the conversations when a CONVERSATION_BUMPED event is triggered', () => {
      const CONVERSATIONS: Conversation[] = createConversationsArray(3);
      const conversationsInNewOrder = [CONVERSATIONS[2], CONVERSATIONS[0], CONVERSATIONS[1]];
      component.conversations = CONVERSATIONS;
      component.ngOnInit();

      expect(component.conversations).toEqual(CONVERSATIONS);
      eventService.emit(EventService.CONVERSATION_BUMPED, conversationsInNewOrder);

      expect(component.conversations).toEqual(conversationsInNewOrder);
    });
  });

  describe('sendRead', () => {
    beforeEach(() => {
      spyOn(conversationService, 'sendRead');
      spyOn(Visibility, 'onVisible').and.callFake((callback: Function) => callback());
    });

    it('should send conversation read confirm if the conversation open is the current', fakeAsync(() => {
      component['conversation'] = MOCK_CONVERSATION();
      const message: Message = MOCK_MESSAGE;
      message.fromSelf = false;

      component['sendRead'](message);
      tick(1000);

      expect(conversationService.sendRead).toHaveBeenCalled();
    }));

    it('should NOT send conversation read confirm if the conversation open is NOT the current', fakeAsync(() => {
      component['conversation'] = SECOND_MOCK_CONVERSATION;

      component['sendRead'](MOCK_MESSAGE);
      tick(1000);

      expect(conversationService.sendRead).not.toHaveBeenCalled();
    }));
  });
  describe('setCurrentConversationWithConversationId', () => {
    it('should call getConversationPage of conversationService', () => {
      spyOn(conversationService, 'getConversationPage');

      (component as any).setCurrentConversationWithConversationId(MOCK_CONVERSATION().id);

      expect(conversationService.getConversationPage).toHaveBeenCalledWith(MOCK_CONVERSATION().id);
    });

    it('should call createConversationAndSetItCurrent if the page is not found', () => {
      spyOn(conversationService, 'getConversationPage').and.returnValue(-1);
      spyOn((component as any), 'createConversationAndSetItCurrent');

      (component as any).setCurrentConversationWithConversationId(MOCK_CONVERSATION().id);

      expect((component as any).createConversationAndSetItCurrent).toHaveBeenCalled();
    });

    it('should select the conversation if the page is found and it is the first', () => {
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
      spyOn(conversationService, 'createConversation').and.returnValue(Observable.of(SECOND_MOCK_CONVERSATION));
    });

    it('should call createConversation of the service', () => {
      const conversation = MOCK_CONVERSATION();
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(conversation));

      (component as any).createConversationAndSetItCurrent();

      expect(conversationService.createConversation).toHaveBeenCalledWith('newConversationItemId');
    });

    it('should call the getSingleConversationMessages and call addLead & setCurrentconversation with the response', () => {
      const convWithMessages = MOCK_CONVERSATION();
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(convWithMessages));
      spyOn(component, 'setCurrentConversation');

      (component as any).createConversationAndSetItCurrent();

      expect(conversationService.getSingleConversationMessages).toHaveBeenCalledWith(SECOND_MOCK_CONVERSATION);
      expect(conversationService.addLead).toHaveBeenCalledWith(convWithMessages);
      expect(component.setCurrentConversation).toHaveBeenCalledWith(convWithMessages);
    });

    it('should subscribe to EventService.REQUEST_PHONE when called', () => {
      const conversation = SECOND_MOCK_CONVERSATION;
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(conversation));
      spyOn(eventService, 'subscribe');

      (component as any).createConversationAndSetItCurrent();

      expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.REQUEST_PHONE);
    });

    it('should call messageService.addPhoneNumberRequestMessage when a REQUEST_PHONE event is triggered', () => {
      const conversation = SECOND_MOCK_CONVERSATION;
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(conversation));
      spyOn(messageService, 'addPhoneNumberRequestMessage');

      (component as any).createConversationAndSetItCurrent();
      eventService.emit(EventService.REQUEST_PHONE);

      expect(messageService.addPhoneNumberRequestMessage).toHaveBeenCalled();
    });

    it('should NOT call messageService.addPhoneNumberRequestMessage when a REQUEST_PHONE event is NOT triggered', () => {
      const conversation = SECOND_MOCK_CONVERSATION;
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(conversation));
      spyOn(messageService, 'addPhoneNumberRequestMessage');

      (component as any).createConversationAndSetItCurrent();

      expect(messageService.addPhoneNumberRequestMessage).not.toHaveBeenCalled();
    });

    it('should call conversationService.openPhonePopup when a REQUEST_PHONE event is triggered AND requestType is popup', () => {
      const conversation = SECOND_MOCK_CONVERSATION;
      spyOn(conversationService, 'getSingleConversationMessages').and.returnValue(Observable.of(conversation));
      spyOn(conversationService, 'openPhonePopup');

      (component as any).createConversationAndSetItCurrent();
      eventService.emit(EventService.REQUEST_PHONE, phoneMethod.popUp);

      expect(conversationService.openPhonePopup).toHaveBeenCalledWith(conversation, true);
    });
  });

  describe('filterByArchived', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track');
      spyOn<any>(component, 'getConversations').and.callThrough();
      spyOn(conversationService, 'getPage').and.returnValue(Observable.of([]));
    });

    it('should set archive true', () => {
      component.filterByArchived(true);

      expect(component.archive).toBe(true);
      expect(component['getConversations']).toHaveBeenCalled();
      expect(conversationService.getPage).toHaveBeenCalledWith(1, true);
    });

    it('should set archive false', () => {
      component.filterByArchived(false);

      expect(component.archive).toBe(false);
      expect(component['getConversations']).toHaveBeenCalled();
      expect(conversationService.getPage).toHaveBeenCalledWith(1, false);
    });
  });

  describe('update the blocked status of users in conversations, when a PRIVACY_LIST_CHANGED event is triggered', () => {
    let userId;
    beforeEach(() => {
      component.ngOnInit();
      component.conversations = createConversationsArray(1);
      userId = component.conversations[0].user.id;
    });

    it(`should update blocked to true when an unblocked user's ID is present in the updated blockedIds array`, () => {
      const blockedIds = [userId];
      component.conversations[0].user.blocked = false;

      eventService.emit(EventService.PRIVACY_LIST_UPDATED, blockedIds);

      expect(component.conversations[0].user.blocked).toBe(true);
    });

    it(`should update blocked to false when a blocked user's id is not present in the updated blockedIds array`, () => {
      const blockedIds = ['some-other-user-id'];
      component.conversations[0].user.blocked = true;

      eventService.emit(EventService.PRIVACY_LIST_UPDATED, blockedIds);

      expect(component.conversations[0].user.blocked).toBe(false);
    });
  });

});

