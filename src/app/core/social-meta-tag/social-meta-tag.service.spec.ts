import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import {
  FACEBOOK_META_TAG_NAMES,
  TWITTER_META_TAG_NAMES,
} from './enums/social-meta-tag-names.enum';
import { SocialMetaTagService } from './social-meta-tag.service';

describe('SocialMetaTagService', () => {
  let socialMetaTagService: SocialMetaTagService;
  let metaService: Meta;

  const TWITTER_META_TAG_DEFAULT = {
    prefix: 'twitter:',
    card: 'summary',
    site: '@wallapop',
  };

  const FACEBOOK_META_TAG_DEFAULT = {
    prefix: 'og:',
    type: 'product',
  };

  const title = 'title';
  const description = 'description';
  const url = 'url';
  const image = 'image';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialMetaTagService],
    }).compileComponents();
    socialMetaTagService = TestBed.inject(SocialMetaTagService);
    metaService = TestBed.inject(Meta);
  });

  describe('when requesting twitter meta tags to be inserted', () => {
    it('should add as many tags as twitter requires', () => {
      spyOn(metaService, 'addTag');
      const metaTagsCount = Object.keys(TWITTER_META_TAG_NAMES).length;

      socialMetaTagService.insertTwitterMetaTags(title, description, image);

      expect(metaService.addTag).toHaveBeenCalledTimes(metaTagsCount);
    });

    it('should add tags with provided data', () => {
      spyOn(metaService, 'addTag');
      const content = { title, description, image };

      socialMetaTagService.insertTwitterMetaTags(title, description, image);

      Object.keys(TWITTER_META_TAG_NAMES).forEach((metaTagName: string) => {
        expect(metaService.addTag).toHaveBeenCalledWith({
          name: `${TWITTER_META_TAG_DEFAULT.prefix}${metaTagName}`,
          content:
            TWITTER_META_TAG_DEFAULT[metaTagName] || content[metaTagName],
        });
      });
    });
  });

  describe('when requesting facebook meta tags to be inserted', () => {
    it('should add as many tags as facebook requires', () => {
      spyOn(metaService, 'addTag');
      const metaTagsCount = Object.keys(FACEBOOK_META_TAG_NAMES).length;

      socialMetaTagService.insertFacebookMetaTags(
        title,
        description,
        image,
        url
      );

      expect(metaService.addTag).toHaveBeenCalledTimes(metaTagsCount);
    });

    it('should add tags with provided data', () => {
      spyOn(metaService, 'addTag');
      const content = { title, description, image, url };

      socialMetaTagService.insertFacebookMetaTags(
        title,
        description,
        image,
        url
      );

      Object.keys(FACEBOOK_META_TAG_NAMES).forEach((metaTagName: string) => {
        expect(metaService.addTag).toHaveBeenCalledWith({
          name: `${FACEBOOK_META_TAG_DEFAULT.prefix}${metaTagName}`,
          content:
            FACEBOOK_META_TAG_DEFAULT[metaTagName] || content[metaTagName],
        });
      });
    });
  });
});
