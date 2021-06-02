export interface HashtagSuggester {
  text: string;
  ocurrencies: number;
}

export interface HashtagSuggesterResponse {
  prefix: string;
  hashtags: HashtagSuggester[];
}
