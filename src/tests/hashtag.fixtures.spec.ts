import { Hashtag, HashtagResponse } from '../app/private/features/upload/core/models/hashtag.interface';

export const MOCK_PREFIX_HASHTAG: string = 'aa';

export const MOCK_HASHTAGS: Hashtag[] = [
  { text: 'ab', occurrencies: 1 },
  { text: 'abc', occurrencies: 2 },
];

export const MOCK_HASHTAG_RESPONSE: HashtagResponse = {
  hashtags: MOCK_HASHTAGS,
};
