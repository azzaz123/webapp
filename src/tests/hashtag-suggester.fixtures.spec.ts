import {
  Hashtag,
  HashtagResponse,
  HashtagWithOccurenciesInfo,
  HashtagWithPrefixResponse,
} from '../app/private/features/upload/core/models/hashtag-suggester.interface';

export const MOCK_PREFIX_HASHTAG: string = 'aa';

export const MOCK_HASHTAGS: Hashtag[] = [{ text: 'ab' }, { text: 'abc' }];

export const MOCK_HASHTAGS_WITH_OCCURENCIES: HashtagWithOccurenciesInfo[] = [
  { text: MOCK_HASHTAGS[0].text, ocurrencies: 1 },
  { text: MOCK_HASHTAGS[1].text, ocurrencies: 2 },
];

export const MOCK_HASHTAG_WITH_PRIFX_RESPONSE: HashtagWithPrefixResponse = {
  prefix: MOCK_PREFIX_HASHTAG,
  hashtags: MOCK_HASHTAGS_WITH_OCCURENCIES,
};

export const MOCK_HASHTAG_RESPONSE: HashtagResponse = {
  hashtags: MOCK_HASHTAGS,
};
