import { HashtagSuggester, HashtagSuggesterResponse } from '../app/private/features/upload/core/models/hashtag-suggester.interface';

export const MOCK_PREFIX_HASHTAG_SUGGESTERS: string = 'aa';

export const MOCK_HASHTAG_SUGGESTERS: HashtagSuggester[] = [
  { text: 'aa', ocurrencies: 14 },
  { text: 'aabb', ocurrencies: 10 },
  { text: 'aaag', ocurrencies: 2 },
  { text: 'aaba', ocurrencies: 5 },
  { text: 'aafa', ocurrencies: 13 },
  { text: 'aab', ocurrencies: 18 },
  { text: 'aaf', ocurrencies: 1 },
  { text: 'aasf', ocurrencies: 1 },
  { text: 'aaeaf', ocurrencies: 1 },
  { text: 'aafd', ocurrencies: 1 },
  { text: 'aafs', ocurrencies: 1 },
  { text: 'aafq', ocurrencies: 1 },
  { text: 'aasaf', ocurrencies: 1 },
  { text: 'aafe', ocurrencies: 1 },
  { text: 'aaf', ocurrencies: 1 },
  { text: 'aawadf', ocurrencies: 1 },
  { text: 'aasaf', ocurrencies: 1 },
  { text: 'aadf', ocurrencies: 1 },
  { text: 'aadsf', ocurrencies: 1 },
];

export const MOCK_HASHTAG_SUGGESTERS_RESPONSE: HashtagSuggesterResponse = {
  prefix: MOCK_PREFIX_HASHTAG_SUGGESTERS,
  hashtags: MOCK_HASHTAG_SUGGESTERS,
};
