import { TestBed } from '@angular/core/testing';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemSocialShareService } from './item-social-share.service';

describe('ItemSocialShareService', () => {
  let service: ItemSocialShareService;
  let socialMetaTagService: SocialMetaTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialMetaTagService, ItemSocialShareService],
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
        MOCK_ITEM.webLink
      );
    });
  });
});
