import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';
import { InboxMessage } from '../message/inbox-message';

export class CurrentConversation extends InboxConversation {
    private _messages: InboxMessage[] = [];

    set messages(value: Array<InboxMessage>) {
        this._messages = value;
    }

    get messages(): Array<InboxMessage> {
        return this._messages;
    }
}
