import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { FacebookMetaTagsData } from './enums/interfaces/facebook-meta-tags-data.interface';
import {
  GenericMetaTagsData,
  MetaTagsData,
} from './enums/interfaces/generic-meta-tags-data.interface';
import { TwitterMetaTagsData } from './enums/interfaces/twitter-meta-tags-data.interface';
import {
  FACEBOOK_META_TAG_NAMES,
  TWITTER_META_TAG_NAMES,
} from './enums/social-meta-tag-names.enum';

@Injectable()
export class SocialMetaTagService {
  private readonly TWITTER_META_TAG_DEFAULT = {
    prefix: 'twitter:',
    card: 'summary',
    site: '@wallapop',
  };

  private readonly FACEBOOK_META_TAG_DEFAULT = {
    prefix: 'og:',
    type: 'product',
  };

  constructor(private metaService: Meta) {}

  public insertTwitterMetaTags(
    title: string,
    description: string,
    image: string
  ): void {
    this.getTwitterMetaTags({ title, description, image }).forEach(
      (metaTag: MetaDefinition) => {
        this.metaService.addTag(metaTag);
      }
    );
  }

  public insertFacebookMetaTags(
    title: string,
    description: string,
    image: string,
    url: string
  ): void {
    this.getFacebookMetaTags({ title, description, image, url }).forEach(
      (metaTag: MetaDefinition) => {
        this.metaService.addTag(metaTag);
      }
    );
  }

  private getFacebookMetaTags(content: FacebookMetaTagsData): MetaDefinition[] {
    return this.buildMetaTags({
      names: FACEBOOK_META_TAG_NAMES,
      defaults: this.FACEBOOK_META_TAG_DEFAULT,
      content,
    });
  }

  private getTwitterMetaTags(content: TwitterMetaTagsData): MetaDefinition[] {
    return this.buildMetaTags({
      names: TWITTER_META_TAG_NAMES,
      defaults: this.TWITTER_META_TAG_DEFAULT,
      content,
    });
  }

  private buildMetaTags(data: MetaTagsData<any>): any {
    const metaTags: MetaDefinition[] = [];
    Object.keys(data.names).forEach((metaTagName: string) => {
      metaTags.push({
        name: `${data.defaults.prefix}${metaTagName}`,
        content: data.defaults[metaTagName] || data.content[metaTagName],
      });
    });

    return metaTags;
  }
}
