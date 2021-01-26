import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SocialShareComponent } from './social-share.component';

export default {
  title: 'Webapp/Shared/SocialShare',
  component: SocialShareComponent,
} as Meta;

const Template: Story<SocialShareComponent> = (args: SocialShareComponent) => ({
  component: SocialShareComponent,
  props: args,
  moduleMetadata: {
    declarations: [SocialShareComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-social-share [title]="title" [facebook]="facebook" [twitter]="twitter" [email]="email"></tsl-social-share>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Share it with your friends',
  facebook: {
    url: 'https://www.wallapop.com',
  },
  twitter: {
    url: 'https://www.wallapop.com',
    text: 'Sharing this from @wallapop!',
  },
  email: {
    url: 'https://www.wallapop.com',
    subject: "Look what I've found",
    message: 'Take a look at this',
  },
};

export const Facebook = Template.bind({});
Facebook.args = {
  title: 'Share on Facebook',
  facebook: {
    url: 'https://www.wallapop.com',
  },
};

export const Twitter = Template.bind({});
Twitter.args = {
  title: 'Share on Twitter',
  twitter: {
    url: 'https://www.wallapop.com',
    text: 'Sharing this from @wallapop!',
  },
};

export const Email = Template.bind({});
Email.args = {
  title: 'Share via email',
  email: {
    url: 'https://www.wallapop.com',
    subject: "Look what I've found",
    message: 'Take a look at this',
  },
};
