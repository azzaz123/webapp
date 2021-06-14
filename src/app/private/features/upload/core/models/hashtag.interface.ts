export interface Hashtag {
  text: string;
  ocurrencies: number;
}

export interface HashtagResponse {
  hashtags: Hashtag[];
}
