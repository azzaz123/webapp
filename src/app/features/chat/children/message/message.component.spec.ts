import { Directive } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/inbox.fixtures.spec';
import { MessageComponent } from './message.component';

@Directive()
class MessageComponentMock extends MessageComponent {}

describe('MessageComponent', () => {
  let component: MessageComponent;

  beforeEach(() => {
    component = new MessageComponentMock();
    component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear inbox conversation', () => {
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();

    expect(component.currentConversation).not.toBeNull();
  });

  it('should check if message contains html tag', () => {
    expect(component.containsHTMLTag(null)).toBeFalsy();
    expect(component.containsHTMLTag('')).toBeFalsy();
    expect(component.containsHTMLTag('Sample text')).toBeFalsy();
    expect(component.containsHTMLTag('<p> Sample text')).toBeTruthy();
    expect(component.containsHTMLTag('<p> Sample text </p>')).toBeTruthy();
    expect(component.containsHTMLTag('Sample text www.wallapop.com')).toBeFalsy();
    expect(component.containsHTMLTag('Sample text <a>www.wallapop.com</a>')).toBeTruthy();
  });
});
