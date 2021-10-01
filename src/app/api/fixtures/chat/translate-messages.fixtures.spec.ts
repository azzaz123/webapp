import { TranslateMessagesMessage, TranslateMessagesResponse } from '@api/chat/dtos';
import { MOCK_INBOX_MESSAGE } from '@fixtures/chat';

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
