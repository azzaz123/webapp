import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { CurrentConversationComponent } from './current-conversation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { InboxMessage } from '../message/inbox-message';
import { USER_ID } from '../../../../tests/user.fixtures.spec';
import { messageStatus } from '../../../core/message/message';
import { RealTimeService } from '../../../core/message/real-time.service';
import { EventService } from '../../../core/event/event.service';

describe('CurrentConversationComponent', () => {
  let component: CurrentConversationComponent;
  let fixture: ComponentFixture<CurrentConversationComponent>;
  let realTime: RealTimeService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MomentModule ],
      declarations: [ CurrentConversationComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ EventService,
        { provide: RealTimeService, useValue: { sendRead() {} }}
      ]
    });
    fixture = TestBed.createComponent(CurrentConversationComponent);
    component = fixture.componentInstance;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    realTime = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
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
        const newMessage = new InboxMessage('someId', component.currentConversation.id, 'hola!',
        component.currentConversation.messages[0].from, true, new Date(), messageStatus.RECEIVED);

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).toHaveBeenCalledWith(component.currentConversation.user.id, component.currentConversation.id);
      }));

      it(`should NOT call realTime.sendRead when a MESSAGE_ADDED event is triggered with a message NOT belonging
        to the currentConversation`, fakeAsync(() => {
        const newMessage = new InboxMessage('someId', 'other-thread-id', 'hola!',
        component.currentConversation.messages[0].from, true, new Date(), messageStatus.RECEIVED);

        component.ngOnInit();
        eventService.emit(EventService.MESSAGE_ADDED, newMessage);
        tick(1000);

        expect(realTime.sendRead).not.toHaveBeenCalled();
      }));
    });

    it('should  NOT call realTime.sendRead when a MESSAGE_ADDED event AND the browser window is NOT visible', fakeAsync(() => {
      spyOn(Visibility, 'onVisible').and.callFake(() => false);
      const newMessage = new InboxMessage('someId', component.currentConversation.id, 'hola!',
        component.currentConversation.messages[0].from, true, new Date(), messageStatus.RECEIVED);

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
      nextMessage = new InboxMessage('123', component.currentConversation.id, 'new msg', USER_ID, true, new Date(),
      messageStatus.RECEIVED);
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
});
