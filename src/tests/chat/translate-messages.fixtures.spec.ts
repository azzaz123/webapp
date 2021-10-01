import { TranslateMessagesMessage, TranslateMessagesResponse } from '@api/chat/dtos';
import { MessageTranslation } from '@api/core/model/chat';
import { MOCK_INBOX_MESSAGE } from '@fixtures/inbox.fixtures.spec';

export const translateMessagesMessageFixture: TranslateMessagesMessage = {
  id: MOCK_INBOX_MESSAGE.id,
  translation: 'translation',
  text: MOCK_INBOX_MESSAGE.text,
  from_self: MOCK_INBOX_MESSAGE.fromSelf,
  timestamp: MOCK_INBOX_MESSAGE.date.getTime(),
  status: MOCK_INBOX_MESSAGE.status,
  type: MOCK_INBOX_MESSAGE.type,
};

export const translateMessagesResponseFixture: TranslateMessagesResponse = {
  messages: [translateMessagesMessageFixture],
};

export const messageTranslationFixture: MessageTranslation = {
  id: translateMessagesMessageFixture.id,
  translation: translateMessagesMessageFixture.translation,
};
