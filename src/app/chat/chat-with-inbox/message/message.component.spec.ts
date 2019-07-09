import { MessageComponent } from './message.component';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';

class MessageComponentMock extends MessageComponent {
}

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
    component.message.phoneRequest = 'PHONE_NUMBER';
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    component.ngOnInit();
    expect(component.currentConversation).not.toBeNull();
  });

  it('should not clear inbox conversation', () => {
    component.message.phoneRequest = null;
    component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
    component.ngOnInit();
    expect(component.currentConversation).toBeNull();
  });
});
