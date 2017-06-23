/* tslint:disable:no-unused-variable */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { MessageService, MOCK_CONVERSATION, EventService, Conversation } from 'shield';
import { By } from '@angular/platform-browser';

class MockMessageService {
  send(c: Conversation, t: string): void {
  }
}

describe('Component: Input', () => {

  let component: InputComponent;
  let messageService: MessageService;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      providers: [
        {provide: MessageService, useClass: MockMessageService},
        EventService
      ]
    });
    fixture = TestBed.createComponent(InputComponent);
    component = TestBed.createComponent(InputComponent).componentInstance;
    messageService = TestBed.get(MessageService);
    spyOn(messageService, 'send');
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

  });

});
