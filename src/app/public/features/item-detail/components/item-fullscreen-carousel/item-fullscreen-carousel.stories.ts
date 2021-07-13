import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ItemFullScreenCarouselComponent } from './item-fullscreen-carousel.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@shared/button/button.module';
import { CommonModule } from '@angular/common';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MOCK_ITEM_CAR } from '@fixtures/item.fixtures.spec';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { HammerModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/ItemFullScreenCarousel',
  component: ItemFullScreenCarouselComponent,
} as Meta;

const Template: Story<ItemFullScreenCarouselComponent> = (args: ItemFullScreenCarouselComponent) => ({
  component: ItemFullScreenCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemFullScreenCarouselComponent],
    imports: [
      SvgIconModule,
      SlidesCarouselModule,
      HttpClientModule,
      FavouriteIconModule,
      ButtonModule,
      CommonModule,
      CustomCurrencyModule,
      PinchZoomModule,
      HammerModule,
      RouterTestingModule,
    ],
    providers: [
      CheckSessionService,
      ItemCardService,
      ItemApiService,
      DeviceDetectorService,
      HAMMER_PROVIDER,
      { provide: CookieService, useValue: MockCookieService },
    ],
  },
});

const imagesURL = ['http://localhost:6006/images/item-camera.jpg', 'http://localhost:6006/images/item-pc.jpg'];

export const Large = Template.bind({});
Large.args = {
  images: imagesURL,
  item: MOCK_ITEM_CAR,
  hidden: false,
};
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const Medium = Template.bind({});
Medium.args = {
  images: imagesURL,
  item: MOCK_ITEM_CAR,
  hidden: false,
};
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Small = Template.bind({});
Small.args = {
  images: imagesURL,
  item: MOCK_ITEM_CAR,
  hidden: false,
};
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  images: imagesURL,
  item: MOCK_ITEM_CAR,
  hidden: false,
};
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
