export interface Hashtag {
  text: string;
}

export interface HashtagWithOccurenciesInfo extends Hashtag {
  ocurrencies: number;
}

export interface HashtagWithPrefixResponse {
  prefix: string;
  hashtags: HashtagWithOccurenciesInfo[];
}

export interface HashtagResponse {
  hashtags: Hashtag[];
}
