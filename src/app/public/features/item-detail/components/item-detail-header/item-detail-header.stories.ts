import { Story, Meta } from '@storybook/angular/types-6-0';
import { CommonModule } from '@angular/common';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemDetailHeaderComponent } from './item-detail-header.component';
import { MOCK_ITEM, MOCK_ITEM_SOLD } from '@fixtures/item.fixtures.spec';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { ErrorsService } from '@core/errors/errors.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ReviewService } from '@core/review/review.service';
import { UserBasicInfoModule } from '@public/shared/components/user-basic-info/user-basic-info.module';
import { ButtonModule } from '@shared/button/button.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DateCountDownModule } from '@shared/date-countdown/date-countdown.module';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { HttpClientModule } from '@angular/common/http';
import { ItemDetailService } from '../../core/services/item-detail/item-detail.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/ItemDetailHeader',
  component: ItemDetailHeaderComponent,
} as Meta;

const Template: Story<ItemDetailHeaderComponent> = (args: ItemDetailHeaderComponent) => ({
  component: ItemDetailHeaderComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemDetailHeaderComponent],
    imports: [
      CommonModule,
      UserBasicInfoModule,
      ButtonModule,
      FavouriteIconModule,
      SvgIconModule,
      DateCountDownModule,
      NgbModalModule,
      NgbTooltipModule,
      NgbDropdownModule,
      RouterTestingModule,
      HttpClientModule,
    ],
    providers: [
      PublicProfileService,
      ErrorsService,
      ToastService,
      ReviewService,
      PublicUserApiService,
      RecommenderApiService,
      ItemDetailService,
      ItemApiService,
      MapItemService,
      CheckSessionService,
      ItemCardService,
      { provide: CookieService, useValue: MockCookieService },
    ],
  },
  template: '<tsl-item-detail-header [item]="item" [user]="user" [userStats]="userStats" [isOwner]="isOwner" ></tsl-item-detail-header>',
});

export const MineAvailableLG = Template.bind({});
MineAvailableLG.args = {
  isOwner: true,
  item: MOCK_ITEM,
  user: MOCK_USER,
  userStats: MOCK_USER_STATS,
};
MineAvailableLG.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const MineAvailableSM = Template.bind({});
MineAvailableSM.args = {
  isOwner: true,
  item: MOCK_ITEM,
  user: MOCK_USER,
  userStats: MOCK_USER_STATS,
};
MineAvailableSM.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const MineAvailableXS = Template.bind({});
MineAvailableXS.args = {
  isOwner: true,
  item: MOCK_ITEM,
  user: MOCK_USER,
  userStats: MOCK_USER_STATS,
};
MineAvailableXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const MineSoldLG = Template.bind({});
MineSoldLG.args = {
  isOwner: true,
  item: MOCK_ITEM_SOLD,
  user: MOCK_USER,
  userStats: MOCK_USER_STATS,
};
MineSoldLG.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const MineSoldXS = Template.bind({});
MineSoldXS.args = { isOwner: true, item: MOCK_ITEM_SOLD, user: MOCK_USER, userStats: MOCK_USER_STATS };
MineSoldXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const OtherAvailableLG = Template.bind({});
OtherAvailableLG.args = { isOwner: false, item: MOCK_ITEM, user: MOCK_USER, userStats: MOCK_USER_STATS };
OtherAvailableLG.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const OtherAvailableSM = Template.bind({});
OtherAvailableSM.args = { isOwner: false, item: MOCK_ITEM, user: MOCK_USER, userStats: MOCK_USER_STATS };
OtherAvailableSM.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const OtherAvailableXS = Template.bind({});
OtherAvailableXS.args = { isOwner: false, item: MOCK_ITEM, user: MOCK_USER, userStats: MOCK_USER_STATS };
OtherAvailableXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const OtherSoldLG = Template.bind({});
OtherSoldLG.args = { isOwner: false, item: MOCK_ITEM_SOLD, user: MOCK_USER, userStats: MOCK_USER_STATS };
OtherSoldLG.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const OtherSoldXS = Template.bind({});
OtherSoldXS.args = { isOwner: false, item: MOCK_ITEM_SOLD, user: MOCK_USER, userStats: MOCK_USER_STATS };
OtherSoldXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
