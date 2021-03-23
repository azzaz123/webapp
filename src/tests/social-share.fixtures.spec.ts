import { SocialShare } from '@public/features/item-detail/interfaces/social-share.interface';

export const MOCK_SOCIAL_SHARE: SocialShare = {
  title: 'Title',
  facebook: {
    url: 'urlFacebook',
  },
  twitter: {
    url: 'urlTwitter',
    text: 'textTwitter',
  },
  email: {
    url: 'urlEmail',
    subject: 'subjectEmail',
    message: 'messageEmail',
  },
};
