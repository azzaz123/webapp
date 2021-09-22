import { mapTranslateMessagesResponseToMessageTranslations } from './translate-messages-response-to-message-translations.mapper';
import { messageTranslationFixture, translateMessagesResponseFixture } from '@api/fixtures/chat';

describe('TranslateMessagesResponseToMessageTranslationsMapper', () => {
  describe('when mapping message from TranslateMessages context to MessageTranslation domain', () => {
    it('should correctly map to our domain', () => {
      const messages = mapTranslateMessagesResponseToMessageTranslations(translateMessagesResponseFixture);

      expect(messages).toEqual([messageTranslationFixture]);
    });
  });
});
