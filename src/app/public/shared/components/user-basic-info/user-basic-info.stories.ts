import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';
import { SIZE } from '@public/shared/constants/user-basic-info-constants';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { UserBasicInfoComponent } from './user-basic-info.component';

export default {
  title: 'Webapp/Public/Shared/UserBasicInfo',
  component: UserBasicInfoComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="max-width:500px;">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<UserBasicInfoComponent> = (
  args: UserBasicInfoComponent
) => ({
  component: UserBasicInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [UserBasicInfoComponent],
    imports: [CommonModule, StarsModule, UserAvatarModule, HttpClientModule],
  },
  template:
    '<tsl-user-basic-info [userStats]="userStats" [userInfo]="userInfo" [styleSize]="styleSize"></tsl-user-basic-info>',
});

export const Small = Template.bind({});
Small.args = {
  userStats: MOCK_USER_STATS,
  userInfo: MOCK_FULL_USER_FEATURED,
  styleSize: SIZE.SMALL,
};

export const Big = Template.bind({});
Big.args = {
  userStats: MOCK_USER_STATS,
  userInfo: MOCK_FULL_USER_FEATURED,
  styleSize: SIZE.BIG,
};
