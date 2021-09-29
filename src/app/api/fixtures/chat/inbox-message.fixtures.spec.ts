import { InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';

export const inboxMessageFixture = new InboxMessage(
  'messageId',
  'thread',
  'text',
  'fromId',
  false,
  new Date(),
  MessageStatus.READ,
  MessageType.TEXT
);
