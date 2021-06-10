export interface Hashtag {
  text: string;
}

export interface GeneralHashtag extends Hashtag {
  ocurrencies: number;
}

export interface HashtagResponse {
  prefix: string;
  hashtags: GeneralHashtag[];
}
