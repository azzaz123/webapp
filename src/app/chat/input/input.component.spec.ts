/* tslint:disable:no-unused-variable */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { XmppService } from '../../core/xmpp/xmpp.service';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';

class MockMessageService {
  send(c: Conversation, t: string): void {
  }
}

describe('Component: Input', () => {

  let component: InputComponent;
  let messageService: MessageService;
  let fixture: ComponentFixture<InputComponent>;
  let eventService: EventService;
  let xmppService: XmppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      providers: [
        {provide: MessageService, useClass: MockMessageService},
        {provide: XmppService, useValue: {
          isBlocked() {
          }
        }},
        EventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(InputComponent);
    component = TestBed.createComponent(InputComponent).componentInstance;
    messageService = TestBed.get(MessageService);
    eventService = TestBed.get(EventService);
    xmppService = TestBed.get(XmppService);
    spyOn(messageService, 'send');
  });

  describe('ngOnInit', () => {
    it('should disable input when CONNECTION_ERROR', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_ERROR);
      expect(component.disable).toBeTruthy();
    });
    it('should disable input when CONNECTION_RESTORED', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_RESTORED);
      expect(component.disable).toBeFalsy();
    });
    it('should disable input when USER_BLOCKED', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.ngOnInit();
      eventService.emit(EventService.USER_BLOCKED, USER_ID);
      expect(component.disable).toBeTruthy();
    });
    it('should disable input when USER_UNBLOCKED', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.ngOnInit();
      eventService.emit(EventService.USER_UNBLOCKED, USER_ID);
      expect(component.disable).toBeFalsy();
    });
  });

  describe('sendMessage', () => {

    const EVENT = new Event('event');
    const conversation: Conversation = MOCK_CONVERSATION();
    const TEXT = 'text';
    let textarea: HTMLInputElement;

    beforeEach(() => {
      spyOn(EVENT, 'preventDefault');
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      component.currentConversation = conversation;
    });

    it('should call the send method if texts is present', () => {
      textarea.value = TEXT;
      component.sendMessage(textarea, EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(conversation, TEXT);
      expect(textarea.value).toBe('');
    });

    it('should call the send method if texts is present with spaces', () => {
      textarea.value = '   ' + TEXT + ' ';
      component.sendMessage(textarea, EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(conversation, TEXT);
      expect(textarea.value).toBe('');
    });

    it('should NOT call the send method if texts is empty', () => {
      textarea.value = '';
      component.sendMessage(textarea, EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(textarea.value).toBe('');
    });

    it('should NOT call the send method if texts is just spaces', () => {
      textarea.value = '   ';
      component.sendMessage(textarea, EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(textarea.value).toBe('');
    });

    it('should NOT call the send method if disabled', () => {
      textarea.value = TEXT;
      component.disable = true;
      component.sendMessage(textarea, EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
    });

  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.messageArea = {
        nativeElement: {
          focus() {
          }
        }
      };
      spyOn(component.messageArea.nativeElement, 'focus');
      component.currentConversation = MOCK_CONVERSATION();
    });

    it('should focus the message area', fakeAsync(() => {
      component.ngOnChanges();
      tick(500);
      expect(component.messageArea.nativeElement.focus).toHaveBeenCalled();
    }));

    it('should not do anything if there is no message to read', () => {
      component.messageArea = undefined;
      component.ngOnChanges();
    });

    it('should disable input if user is blocked', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.user.blocked = true;
      component.ngOnChanges();
      expect(component.disable).toBeTruthy();
    });

    it('should enable input if user is blocked', () => {
      component.disable = true;
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.user.blocked = false;
      component.ngOnChanges();
      expect(component.disable).toBeFalsy();
    });

  });

});
