export interface Hashtag {
  text: string;
  occurrencies: number;
}

export interface HashtagResponse {
  hashtags: Hashtag[];
}
