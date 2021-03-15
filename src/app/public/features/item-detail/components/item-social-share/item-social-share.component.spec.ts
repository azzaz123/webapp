import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { SOCIAL_SHARE_MOCK } from '@fixtures/social-share.fixtures.spec';

import { ItemSocialShareComponent } from './item-social-share.component';

describe('ItemSocialShareComponent', () => {
  const socialShareSelector = 'tsl-social-share';

  let component: ItemSocialShareComponent;
  let fixture: ComponentFixture<ItemSocialShareComponent>;
  let socialMetaTagService: SocialMetaTagService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSocialShareComponent],
      providers: [SocialMetaTagService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSocialShareComponent);
    component = fixture.componentInstance;
    socialMetaTagService = TestBed.inject(SocialMetaTagService);

    component.socialShare = SOCIAL_SHARE_MOCK;
    component.item = MOCK_ITEM;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we recieve the social share info...', () => {
    it('should show the social share component', () => {
      const socialShareElement = fixture.debugElement.nativeElement.querySelector(socialShareSelector);

      Object.keys(component.socialShare).forEach((socialShareKey: string) => {
        expect(socialShareElement[socialShareKey]).toEqual(component.socialShare[socialShareKey]);
      });
    });

    describe(`when we DON'T recieve the social share info...`, () => {
      beforeEach(() => {
        component.socialShare = null;

        fixture.detectChanges();
      });

      it('should NOT show the social share component', () => {
        const socialShareElement = fixture.debugElement.query(By.css(socialShareSelector));

        expect(socialShareElement).toBeFalsy();
      });
    });

    describe('when we recieve the item...', () => {
      beforeEach(() => {
        spyOn(socialMetaTagService, 'insertTwitterMetaTags');
        spyOn(socialMetaTagService, 'insertFacebookMetaTags');

        component.ngOnInit();
      });
      it('should initialize the item meta tags...', () => {
        expect(socialMetaTagService.insertTwitterMetaTags).toHaveBeenCalledWith(
          component.item.title,
          component.item.description,
          component.item.mainImage?.urls_by_size?.medium
        );
        expect(socialMetaTagService.insertFacebookMetaTags).toHaveBeenCalledWith(
          component.item.title,
          component.item.description,
          component.item.mainImage?.urls_by_size?.medium,
          component.item.webLink
        );
      });
    });

    describe(`when we DON'T recieve the item...`, () => {
      beforeEach(() => {
        component.item = null;

        component.ngOnInit();
      });

      it('should NOT initialize the item meta tags...', () => {
        spyOn(socialMetaTagService, 'insertTwitterMetaTags');
        spyOn(socialMetaTagService, 'insertFacebookMetaTags');

        expect(socialMetaTagService.insertTwitterMetaTags).not.toHaveBeenCalled();
        expect(socialMetaTagService.insertFacebookMetaTags).not.toHaveBeenCalled();
      });
    });
  });
});
