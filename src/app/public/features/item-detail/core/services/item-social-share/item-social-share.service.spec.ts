import { TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemDetailRoutePipe } from '@shared/pipes';
import { ItemSocialShareService } from './item-social-share.service';

describe('ItemSocialShareService', () => {
  let service: ItemSocialShareService;
  let socialMetaTagService: SocialMetaTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocialMetaTagService,
        ItemSocialShareService,
        ItemDetailRoutePipe,
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });
    service = TestBed.inject(ItemSocialShareService);
    socialMetaTagService = TestBed.inject(SocialMetaTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when calling initializeItemMetaTags', () => {
    it('should insert the metatags', () => {
      spyOn(socialMetaTagService, 'insertTwitterMetaTags');
      spyOn(socialMetaTagService, 'insertFacebookMetaTags');

      service.initializeItemMetaTags(MOCK_ITEM);

      expect(socialMetaTagService.insertTwitterMetaTags).toHaveBeenCalledWith(
        MOCK_ITEM.title,
        MOCK_ITEM.description,
        MOCK_ITEM.mainImage?.urls_by_size?.medium
      );
      expect(socialMetaTagService.insertFacebookMetaTags).toHaveBeenCalledWith(
        MOCK_ITEM.title,
        MOCK_ITEM.description,
        MOCK_ITEM.mainImage?.urls_by_size?.medium,
        `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.webSlug}`
      );
    });
  });
});
