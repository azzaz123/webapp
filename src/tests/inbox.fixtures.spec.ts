import { InboxConversation } from '../app/core/conversation/conversation';
import { Message } from '../app/core/message/message';
import { InboxUser } from '../app/core/user/user';
import { InboxItem } from '../app/core/item/item';
import { MESSAGE_MAIN } from './message.fixtures.spec';
import { OTHER_USER_ID } from './user.fixtures.spec';
import { ITEM_ID } from './item.fixtures.spec';
import { CONVERSATION_DATE } from './conversation.fixtures.spec';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE = '123.456.789';

export const MOCK_INBOX_API_RESPONSE = `{
    "user_hash": "mxzorp9np7z9",
    "page": 1,
    "page_size": 1000,
    "conversations": [
        {
            "hash": "p61y8o5np265",
            "with_user": {
                "hash": "7v6gwyklr5ze",
                "slug": "wallacars-56047883",
                "name": "John D.",
                "avatar_url": "http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640",
                "response_rate": "less_than_a_day",
                "scoring": 100,
                "blocked": false,
                "location": {
                    "latitude": 37.39266063798759,
                    "longitude": -5.977606016287523
                }
            },
            "item": {
                "hash": "9nz0nlmkyv6o",
                "title": "Camiseta",
                "status": "RESERVED",
                "image_url": "http://cdn-beta.wallapop.com/images/10420/30/yi/__/c10420p183008817/i413212126.jpg?pictureSize=W320"
            },
            "phone_shared": true,
            "unread_messages": 1,
            "messages": [
                {
                    "message_id": "20394401-ec61-4032-9eee-e79441fae457",
                    "from": "self",
                    "text": "Vale gracias",
                    "timestamp": "2019-01-28T08:00:20.573038Z",
                    "status": "read"
                },
                {
                    "message_id": "df9455bd-9d3f-4315-abdc-c7c230932347",
                    "from": "other",
                    "text": "Por cuanto vale?",
                    "timestamp": "2019-01-28T08:02:20.573038Z",
                    "status": "read"
                }
            ]
        },
        {
            "hash": "pzp9qx0yd963",
            "with_user": {
                "hash": "xpzp3dpqnk63",
                "slug": "napcard-72673033",
                "name": "John D.",
                "avatar_url": "http://cdn-beta.wallapop.com/images/13/17/9m/__/c13p72673033/i412184103.jpg?pictureSize=W640",
                "response_rate": "less_than_a_day",
                "scoring": 60,
                "blocked": false,
                "location": {
                    "latitude": 37.39266063798759,
                    "longitude": -5.977606016287523
                }
            },
            "item": {
                "hash": "xpzplp4q1563",
                "title": "Bottle of Chato wine",
                "status": "SOLD",
                "image_url": "http://cdn-beta.wallapop.com/images/10420/31/ao/__/c10420p183576804/i413792104.jpg?pictureSize=W320"
            },
            "phone_shared": false,
            "unread_messages": 0,
            "messages": [
                {
                    "message_id": "58AC7C92-1441-4D65-A05B-3FF1EABE48E2",
                    "from": "self",
                    "text": "Vale perfecto",
                    "timestamp": "2019-01-28T08:44:01.571872Z",
                    "status": "sent"
                }
            ]
        },
        {
            "hash": "w67dp08py96x",
            "with_user": {
                "hash": "g0j2wmggemjy",
                "slug": "jessica-44104947",
                "name": "Miss Chat O.",
                "blocked": true
            },
            "item": {
                "hash": "xpzplx1xxm63",
                "title": "Mochila",
                "image_url": ""
            },
            "messages": [
                {
                    "message_id": "9e92af6d-9353-4d36-8369-077ce8846e5f",
                    "from": "other",
                    "text": "Vale, así quedamos!",
                    "timestamp": "2019-02-12T13:58:13.924516Z"
                }
            ]
        }
    ]
  }`;
  export const MOCK_INBOX_CONVERSATION = JSON.parse(MOCK_INBOX_API_RESPONSE).conversations[0];

export const CREATE_MOCK_INBOX_CONVERSATION: Function = (
    id: string = CONVERSATION_ID,
    userId: string = OTHER_USER_ID,
    date: number = CONVERSATION_DATE): InboxConversation => {
      const tempMsg = MOCK_INBOX_CONVERSATION.messages[0];
      const message = new Message(
          tempMsg.id,
          MOCK_INBOX_CONVERSATION.hash,
          tempMsg.text, null,
          new Date(tempMsg.timestamp),
          tempMsg.status);
      message.fromSelf = tempMsg.from === 'self';

      return new InboxConversation(id, date, new InboxUser(userId), new InboxItem(ITEM_ID), message, [message], 0, false, false);
};
export const SECOND_MOCK_INBOX_CONVERSATION: InboxConversation = new InboxConversation('secondId', CONVERSATION_DATE,
  new InboxUser(OTHER_USER_ID), new InboxItem(ITEM_ID));
export const MOCKED_INBOX_CONVERSATIONS: InboxConversation[] = [CREATE_MOCK_INBOX_CONVERSATION(), SECOND_MOCK_INBOX_CONVERSATION];
export const NOT_FOUND_INBOX_CONVERSATION_ID = 'notFound';
export const MOCK_NOT_FOUND_INBOX_CONVERSATION: InboxConversation = new InboxConversation(
  NOT_FOUND_INBOX_CONVERSATION_ID,
  CONVERSATION_DATE,
  new InboxUser(OTHER_USER_ID),
  new InboxItem(ITEM_ID));

export function createInboxConversationsArray(total: number, conversationsId?: string) {
  const conversations: InboxConversation[] = [];
  for (let i = 1; i <= total; i++) {
    conversations.push(CREATE_MOCK_INBOX_CONVERSATION(conversationsId ? i + conversationsId : i.toString(),
    OTHER_USER_ID, CONVERSATION_DATE - i));
  }
  return conversations;
}

