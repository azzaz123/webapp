import { Hashtag, HashtagResponse } from '../app/private/features/upload/core/models/hashtag.interface';

export const MOCK_PREFIX_HASHTAG: string = 'aa';

export const MOCK_HASHTAGS: Hashtag[] = [
  { text: 'ab', occurrences: 1 },
  { text: 'abc', occurrences: 2 },
  { text: 'abcd', occurrences: 1 },
  { text: 'ad', occurrences: 2 },
  { text: 'af', occurrences: 1 },
  { text: 'agd', occurrences: 2 },
];

export const MOCK_HASHTAG_RESPONSE: HashtagResponse = {
  hashtags: MOCK_HASHTAGS,
};
