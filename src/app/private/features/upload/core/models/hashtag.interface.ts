export interface Hashtag {
  text: string;
  ocurrencies: number;
}

export interface HashtagResponse {
  prefix?: string;
  hashtags: Hashtag[];
}
