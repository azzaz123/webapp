import { Conversation } from '@core/conversation/conversation';
import { ConversationResponse } from '@core/conversation/conversation-response.interface';
import { SurveyResponse } from '@core/conversation/lead-response.interface';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { ITEM_ID, ITEM_LEGACY_ID, MOCK_ITEM } from '../item.fixtures.spec';
import { MESSAGE_MAIN } from './message.fixtures.spec';
import { MOCK_USER, USER_ID } from '../user.fixtures.spec';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE = '123.456.789';
export const SURVEY_RESPONSES: SurveyResponse[] = [
  {
    question_id: 1,
    question: '¿Por qué razón quieres comprar un coche?',
    answer: {
      answer_id: 1,
      answer: 'Acabo de sacarme el carné',
    },
  },
  {
    question_id: 2,
    question: '¿Darás tu coche actual a cambio?',
    answer: {
      answer_id: 2,
      answer: 'Quizás',
    },
  },
  {
    question_id: 3,
    question: '¿Cuándo lo querrías comprar?',
    answer: {
      answer_id: 1,
      answer: 'En las próximas semanas',
    },
  },
  {
    question_id: 4,
    question: '¿Quieres venir a ver el coche al concesionario?',
    answer: {
      answer_id: 2,
      answer: 'Sí, podría este mes',
    },
  },
];

export const NEW_CONVERSATION_RESPONSE = {
  seller_user_id: 'seller_user_id',
  buyer_user_id: 'buyer_user_id',
  item_id: 'item_id',
  modified_date: 123123,
  conversation_id: 'conversation_id',
};

export const CONVERSATIONS_DATA: ConversationResponse[] = [
  {
    conversation_id: 'qjwy8gw0e4zo',
    other_user_id: USER_ID,
    user_id: USER_ID,
    item_id: ITEM_ID,
    modified_date: 1521110544000,
  },
  {
    conversation_id: '9jd7q10222jk',
    other_user_id: USER_ID,
    user_id: USER_ID,
    item_id: ITEM_ID,
    modified_date: 1521037322000,
  },
];

export const CONVERSATION_DATE: number = new Date().getTime();
export const CONVERSATION_DATE_ISO: string = new Date().toISOString();

export const MOCK_CONVERSATION: Function = (
  id: string = CONVERSATION_ID,
  userId: string = USER_ID,
  phone?: string,
  date: number = CONVERSATION_DATE
): Conversation => {
  return new Conversation(id, 1, date, false, new User(userId), new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID), [], phone, SURVEY_RESPONSES);
};
export const SECOND_MOCK_CONVERSATION: Conversation = new Conversation('secondId', 2, CONVERSATION_DATE, false, MOCK_USER, MOCK_ITEM);
export const MOCKED_CONVERSATIONS: Conversation[] = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
export const NOT_FOUND_CONVERSATION_ID = 'notFound';
export const MOCK_NOT_FOUND_CONVERSATION: Conversation = new Conversation(
  NOT_FOUND_CONVERSATION_ID,
  99,
  CONVERSATION_DATE,
  false,
  MOCK_USER,
  MOCK_ITEM
);

export function createConversationsArray(total: number, phone?: boolean, conversationsId?: string) {
  const conversations: Conversation[] = [];
  for (let i = 1; i <= total; i++) {
    conversations.push(
      MOCK_CONVERSATION(
        conversationsId ? i + conversationsId : i.toString(),
        undefined,
        phone ? CONVERSATION_PHONE : undefined,
        CONVERSATION_DATE - i
      )
    );
  }
  return conversations;
}

export const MOCK_CONVERSATION_API_RESPONSE = `{
    "hash": "p61y8o5np268",
    "with_user": {
        "hash": "7v6gwyklr5ze",
        "slug": "wallacars-56047883",
        "name": "John D.",
        "image_url": "http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640",
        "response_rate" : "less than a day",
        "score" : 20,
        "blocked": false,
        "available": true,
        "location" : {
           "latitude": 37.39266063798759,
           "longitude": -5.977606016287523
        }
    },
    "item": {
        "hash": "9nz0nlmkyv6o",
        "title": "Camiseta",
        "price": {
            "amount": "12.45",
            "currency": "€"
        },
        "status": "RESERVED",
        "image_url": "http://cdn-beta.wallapop.com/images/10420/30/yi/__/c10420p183008817/i413212126.jpg?pictureSize=W320"
    },
    "phone_shared": true,
    "unread_messages": 1,
    "messages": {
        "next_from": "220382881010",
        "messages": [
              {
                  "id": "20394401-ec61-4032-9eee-e79441fae457",
                  "from_self": true,
                  "text": "Vale gracias",
                  "timestamp": "2019-01-28T08:00:20.573038Z",
                  "status": "read",
                  "type": "text",
                  "payload": {
                  }
              }
        ]
    }
}`;
export const MOCK_API_CONVERSATION = JSON.parse(MOCK_CONVERSATION_API_RESPONSE);
