import { SearchComponent } from '@public/features/search/pages/search.component';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SearchLayoutComponent } from '@public/features/search/components/search-layout/search-layout.component';
import { I18nService } from '@core/i18n/i18n.service';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { FooterModule } from '@public/layout/components/footer/footer.module';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { AccessTokenService } from '@core/http/access-token.service';
import { CookieModule } from 'ngx-cookie';
import { UserService } from '@core/user/user.service';
import { EventService } from '@core/event/event.service';
import { NgxPermissionsStore } from 'ngx-permissions';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';

export default {
  title: 'Webapp/Pages/Search',
  component: SearchComponent,
  decorators: [
    moduleMetadata({
      providers: [
        I18nService,
        AccessTokenService,
        UserService,
        EventService,
        NgxPermissionsStore,
        { provide: 'SUBDOMAIN', useValue: 'www' },
      ],
      declarations: [SearchComponent, SearchLayoutComponent],
      imports: [
        SvgIconModule,
        HttpClientModule,
        ItemCardListModule,
        FooterModule,
        CheckSessionModule,
        CookieModule.forRoot(),
        CoreModule,
        SharedModule,
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
