import { formatDescription } from '@api/catalog/mappers/utils/storytelling';
import { ItemType } from '@api/core/model/item';
import {
  mappedPublishedItemFixture,
  mappedStorytellingPublishedItemFixture,
  publishedItemFixture,
  storytellingPublishedItemFixture,
} from '@api/fixtures/catalog/published/published-item.fixtures';

describe('Storytelling util', () => {
  describe('when asked to format description', () => {
    describe('and is not part of the storytelling types', () => {
      it('should not create storytelling, returning description', () => {
        const description = formatDescription(ItemType.CONSUMER_GOODS, publishedItemFixture.description, publishedItemFixture.attributes);

        expect(description).toEqual(mappedPublishedItemFixture.description);
      });
    });

    describe('and is part of the storytelling types', () => {
      it('should create storytelling', () => {
        const description = formatDescription(
          ItemType.CARS,
          storytellingPublishedItemFixture.description,
          storytellingPublishedItemFixture.attributes
        );

        expect(description).toEqual(mappedStorytellingPublishedItemFixture.description);
      });
    });
  });
});
