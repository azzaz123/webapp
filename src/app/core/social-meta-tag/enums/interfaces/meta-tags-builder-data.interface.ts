import { FacebookMetaTagsData } from './facebook-meta-tags-data.interface';
import { TwitterMetaTagsData } from './twitter-meta-tags-data.interface';

export interface MetaTagsBuilderData {
  names: object;
  defaults: {
    [key: string]: string;
  };
  content: FacebookMetaTagsData | TwitterMetaTagsData;
}
