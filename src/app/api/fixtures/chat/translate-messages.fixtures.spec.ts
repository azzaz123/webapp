import { TranslateMessagesMessage, TranslateMessagesResponse } from '@api/chat/dtos';

export const messageTranslationFixture: TranslateMessagesMessage = {
  id: 'messageId',
  translation: 'translation',
  text: 'text',
  from_self: false,
  timestamp: new Date().getTime(),
  status: null,
  type: null,
};

export const translateMessagesResponseFixtures: TranslateMessagesResponse = {
  messages: [messageTranslationFixture],
};
