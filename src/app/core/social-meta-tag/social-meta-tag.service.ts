import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { FacebookMetaTagsData } from './enums/interfaces/facebook-meta-tags-data.interface';
import { GenericMetaTagsData } from './enums/interfaces/generic-meta-tags-data.interface';
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
    return this.buildMetaTags(
      FACEBOOK_META_TAG_NAMES,
      this.FACEBOOK_META_TAG_DEFAULT,
      content
    );
  }

  private getTwitterMetaTags(content: TwitterMetaTagsData): MetaDefinition[] {
    return this.buildMetaTags(
      TWITTER_META_TAG_NAMES,
      this.TWITTER_META_TAG_DEFAULT,
      content
    );
  }

  private buildMetaTags(
    names: GenericMetaTagsData,
    defaults: GenericMetaTagsData,
    content: FacebookMetaTagsData | TwitterMetaTagsData
  ): any {
    const metaTags: MetaDefinition[] = [];
    Object.keys(names).forEach((metaTagName: string) => {
      metaTags.push({
        name: `${defaults.prefix}${metaTagName}`,
        content: defaults[metaTagName] || content[metaTagName],
      });
    });

    return metaTags;
  }
}
