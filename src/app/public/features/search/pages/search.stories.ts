import { SearchComponent } from '@public/features/search/pages/search.component';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SearchLayoutComponent } from '@public/features/search/components/search-layout/search-layout.component';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { HttpModule } from '@core/http/http.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { ItemService } from '@core/item/item.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { ViewportService } from '@core/viewport/viewport.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchStoreService } from '@public/features/search/core/services/search-store.service';
import { FiltersWrapperModule } from '@public/features/search/components/filters-wrapper/filters-wrapper.module';
import { AdSlotShoppingModule } from '@shared/ads/ad-slot-shopping/ad-slot-shopping.module';
import { SearchService } from '@public/features/search/core/services/search.service';
import { SearchInfrastructureService } from '@public/features/search/core/services/infrastructure/search-infrastructure.service';
import { SearchAPIService } from '@public/features/search/core/services/infrastructure/api/search-api.service';
import { SearchFavouritesService } from '@public/features/search/core/services/infrastructure/favorites/search-favourites.service';
import { ExtractFilterConfigsPipe } from '@public/features/search/components/filters-wrapper/pipes/extract-filter-configs.pipe';

export default {
  title: 'Webapp/Public/Features/Search/Pages/Search',
  component: SearchComponent,
  decorators: [
    moduleMetadata({
      providers: [
        ViewportService,
        ItemService,
        EventService,
        I18nService,
        ItemCardService,
        { provide: 'SUBDOMAIN', useValue: 'www' },
        SearchService,
        SearchStoreService,
        SearchInfrastructureService,
        SearchAPIService,
        SearchFavouritesService,
      ],
      declarations: [SearchComponent, SearchLayoutComponent, ExtractFilterConfigsPipe],
      imports: [
        CoreModule,
        SharedModule,
        HttpModule,
        ItemApiModule,
        CheckSessionModule,
        ItemCardListModule,
        RouterTestingModule,
        FiltersWrapperModule,
        AdSlotShoppingModule,
      ],
    }),
    styledWrapperDecorator('margin: -1rem;'),
  ],
};

const Template: Story<SearchComponent> = (args) => ({
  component: SearchComponent,
  props: args,
  template: '<tsl-search></tsl-search>',
});

export const Default = Template.bind({});

export const ExtraLarge = Template.bind({});
ExtraLarge.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XL,
  },
};

export const Large = Template.bind({});
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const Medium = Template.bind({});
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Small = Template.bind({});
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
