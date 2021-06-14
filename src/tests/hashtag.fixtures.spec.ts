import { Hashtag, HashtagResponse } from '../app/private/features/upload/core/models/hashtag.interface';

export const MOCK_PREFIX_HASHTAG: string = 'aa';

export const MOCK_HASHTAGS: Hashtag[] = [
  { text: 'ab', ocurrencies: 1 },
  { text: 'abc', ocurrencies: 2 },
];

export const MOCK_HASHTAG_RESPONSE: HashtagResponse = {
  hashtags: MOCK_HASHTAGS,
};
