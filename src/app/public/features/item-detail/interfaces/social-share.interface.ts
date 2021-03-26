import { EmailShare } from '@shared/social-share/interfaces/email-share.interface';
import { FacebookShare } from '@shared/social-share/interfaces/facebook-share.interface';
import { TwitterShare } from '@shared/social-share/interfaces/twitter-share.interface';

export interface SocialShare {
  title: string;
  facebook: FacebookShare;
  twitter: TwitterShare;
  email: EmailShare;
}
