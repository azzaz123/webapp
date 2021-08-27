export interface Hashtag {
  text: string;
  occurrences: number;
}

export interface HashtagResponse {
  hashtags: Hashtag[];
}
