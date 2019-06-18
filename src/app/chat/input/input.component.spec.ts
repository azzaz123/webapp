/* tslint:disable:no-unused-variable */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { MOCK_CONVERSATION, SECOND_MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

class MockMessageService {
  send(c: Conversation, t: string): void {
  }
}

class NgbModalMock {
}

describe('Component: Input', () => {

  let component: InputComponent;
  let messageService: MessageService;
  let fixture: ComponentFixture<InputComponent>;
  let eventService: EventService;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      providers: [
        {provide: MessageService, useClass: MockMessageService},
        {provide: NgbModal, useClass: NgbModalMock},
        EventService,
        {provide: TrackingService, useValue: {
          track() {}
        }},
        EventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(InputComponent);
    component = TestBed.createComponent(InputComponent).componentInstance;
    messageService = TestBed.get(MessageService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    spyOn(messageService, 'send');
  });

  describe('ngOnInit', () => {
    it('should disable input when the user has been blocked', () => {
      component.currentConversation = MOCK_CONVERSATION();

      component.ngOnInit();
      eventService.emit(EventService.PRIVACY_LIST_UPDATED, [USER_ID]);

      expect(component.disable).toBe(true);
    });
    it('should disable input when the user has been unblocked', () => {
      component.currentConversation = MOCK_CONVERSATION();

      component.ngOnInit();
      eventService.emit(EventService.PRIVACY_LIST_UPDATED, []);

      expect(component.disable).toBe(false);
    });
  });


  describe('sendMessage', () => {

    const EVENT = new Event('event');
    const conversation: Conversation = MOCK_CONVERSATION();
    const TEXT = 'text';
    let textarea: HTMLInputElement;

    beforeEach(() => {
      spyOn(EVENT, 'preventDefault');
      spyOn(trackingService, 'track');
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      component.currentConversation = conversation;
    });

    it('should call the send method and track the SEND_BUTTON event if texts is present', () => {
      textarea.value = TEXT;

      component.sendMessage(textarea, EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(conversation, TEXT);
      expect(textarea.value).toBe('');
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.SEND_BUTTON, {
        thread_id: conversation.id});
      expect(trackingService.track).toHaveBeenCalledTimes(1);
    });

    it('should call the send method and track the SEND_BUTTON event if texts is present with spaces', () => {
      textarea.value = '   ' + TEXT + ' ';

      component.sendMessage(textarea, EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(conversation, TEXT);
      expect(textarea.value).toBe('');
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.SEND_BUTTON, {
        thread_id: conversation.id});
      expect(trackingService.track).toHaveBeenCalledTimes(1);
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if texts is empty', () => {
      textarea.value = '';

      component.sendMessage(textarea, EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(textarea.value).toBe('');
      expect(trackingService.track).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if texts is just spaces', () => {
      textarea.value = '   ';

      component.sendMessage(textarea, EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(textarea.value).toBe('');
      expect(trackingService.track).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if disabled', () => {
      textarea.value = TEXT;
      component.disable = true;

      component.sendMessage(textarea, EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(trackingService.track).not.toHaveBeenCalled();
    });

  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.messageArea = {
        nativeElement: {
          focus() {
          },
          value: ''
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

    it('should reset the input value when the conversation is changed', fakeAsync(() => {
      component.messageArea.nativeElement.value = 'I typed some some text...';
      component.currentConversation = SECOND_MOCK_CONVERSATION;

      component.ngOnChanges(component);
      tick(500);

      expect(component.messageArea.nativeElement.value).toBe('');
    }));

    it('should not do anything if there is no message to read', () => {
      component.messageArea = undefined;

      component.ngOnChanges();
    });

    it('should disable input if user is blocked', () => {
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.user.blocked = true;

      component.ngOnChanges();

      expect(component.disable).toBe(true);
    });

    it('should enable input if user is blocked', () => {
      component.disable = true;
      component.currentConversation = MOCK_CONVERSATION();
      component.currentConversation.user.blocked = false;

      component.ngOnChanges();

      expect(component.disable).toBe(false);
    });

  });

});
