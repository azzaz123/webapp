import { TranslateMessagesMessage, TranslateMessagesResponse } from '@api/chat/dtos';
import { MessageTranslation } from '@api/core/model/chat';

export const translateMessagesMessageFixture: TranslateMessagesMessage = {
  id: 'messageId',
  translation: 'translation',
  text: 'text',
  from_self: false,
  timestamp: new Date().getTime(),
  status: null,
  type: null,
};

export const translateMessagesResponseFixture: TranslateMessagesResponse = {
  messages: [translateMessagesMessageFixture],
};

export const messageTranslationFixture: MessageTranslation = {
  id: translateMessagesMessageFixture.id,
  translation: translateMessagesMessageFixture.translation,
};
