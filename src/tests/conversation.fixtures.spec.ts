import { MESSAGE_MAIN } from './message.fixtures.spec';
import { MOCK_USER, USER_ID } from './user.fixtures.spec';
import { ITEM_ID, ITEM_LEGACY_ID } from './item.fixtures.spec';
import { Conversation } from '../app/core/conversation/conversation';
import { User } from '../app/core/user/user';
import { Item } from '../app/core/item/item';
import { ConversationResponse } from '../app/core/conversation/conversation-response.interface';
import { SurveyResponse } from '../app/core/conversation/lead-response.interface';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE: string = '123.456.789';
export const SURVEY_RESPONSES: SurveyResponse[] = [
  {
    'question_id': 1,
    'question': '¿Por qué razón quieres comprar un coche?',
    'answer': {
      'answer_id': 1,
      'answer': 'Acabo de sacarme el carné'
    }
  },
  {
    'question_id': 2,
    'question': '¿Darás tu coche actual a cambio?',
    'answer': {
      'answer_id': 2,
      'answer': 'Quizás'
    }
  },
  {
    'question_id': 3,
    'question': '¿Cuándo lo querrías comprar?',
    'answer': {
      'answer_id': 1,
      'answer': 'En las próximas semanas'
    }
  },
  {
    'question_id': 4,
    'question': '¿Quieres venir a ver el coche al concesionario?',
    'answer': {
      'answer_id': 2,
      'answer': 'Sí, podría este mes'
    }
  }
];

export const NEW_CONVERSATION_RESPONSE = {
  seller_user_id: 'seller_user_id',
  buyer_user_id: 'buyer_user_id',
  item_id: 'item_id',
  modified_date: 123123,
  conversation_id: 'conversation_id'
};

export const CONVERSATIONS_DATA: ConversationResponse[] = [{
  'conversation_id': 'qjwy8gw0e4zo',
  'other_user_id': USER_ID,
  'item_id': ITEM_ID,
  'modified_date': 1521110544000
}, {
  'conversation_id': '9jd7q10222jk',
  'other_user_id': USER_ID,
  'item_id': ITEM_ID,
  'modified_date': 1521037322000
}];

export const CONVERSATION_DATE: number = new Date().getTime();
export const CONVERSATION_DATE_ISO: string = new Date().toISOString();

export const MOCK_CONVERSATION: Function = (id: string = CONVERSATION_ID, userId: string = USER_ID, phone?: string, date: number = CONVERSATION_DATE): Conversation => {
  return new Conversation(id, 1, date, false, new User(userId), new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID), [], phone, SURVEY_RESPONSES);
};
export const SECOND_MOCK_CONVERSATION: Conversation = new Conversation('secondId', 2, CONVERSATION_DATE, false, MOCK_USER);
export const MOCKED_CONVERSATIONS: Conversation[] = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
export const NOT_FOUND_CONVERSATION_ID: string = 'notFound';
export const MOCK_NOT_FOUND_CONVERSATION: Conversation = new Conversation(
  NOT_FOUND_CONVERSATION_ID,
  99,
  CONVERSATION_DATE,
  false,
  MOCK_USER);

export function createConversationsArray(total: number, phone?: boolean) {
  let conversations: Conversation[] = [];
  for (let i: number = 1; i <= total; i++) {
    conversations.push(MOCK_CONVERSATION(i + '', undefined, phone ? CONVERSATION_PHONE : undefined, CONVERSATION_DATE - i));
  }
  return conversations;
}
