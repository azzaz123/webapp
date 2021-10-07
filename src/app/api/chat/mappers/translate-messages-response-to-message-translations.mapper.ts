import { ToDomainMapper } from '@api/core/utils/types';
import { TranslateMessagesResponse } from '@api/chat/dtos';
import { MessageTranslation } from '@api/core/model/chat/message-translation';

export const mapTranslateMessagesResponseToMessageTranslations: ToDomainMapper<TranslateMessagesResponse, MessageTranslation[]> = (
  response: TranslateMessagesResponse
) => {
  return response.messages.map(({ translation, id }) => ({
    id,
    translation,
  }));
};
