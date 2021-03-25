import { Component, Input } from '@angular/core';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS, ShareItem } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { SocialShareService } from '@core/social-share/social-share.service';
import { User } from '@core/user/user';
import { EmailShare } from './interfaces/email-share.interface';
import { FacebookShare } from './interfaces/facebook-share.interface';
import { TwitterShare } from './interfaces/twitter-share.interface';

@Component({
  selector: 'tsl-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent {
  @Input() item: Item;
  @Input() user: User;
  @Input() title: string;
  @Input() facebook: FacebookShare;
  @Input() twitter: TwitterShare;
  @Input() email: EmailShare;

  constructor(private socialShareService: SocialShareService, private analyticsService: AnalyticsService) {}

  public facebookShare(): void {
    this.socialShareService.facebookShare(this.facebook.url);
    this.trackShareItemEvent('facebook');
  }

  public twitterShare(): void {
    this.socialShareService.twitterShare(this.twitter.url, this.twitter.text);
    this.trackShareItemEvent('twitter');
  }

  public emailShare(): void {
    this.socialShareService.emailShare(this.email.url, this.email.subject, this.email.message);
    this.trackShareItemEvent('email');
  }

  private trackShareItemEvent(channel: 'facebook' | 'messenger' | 'email' | 'whatsapp' | 'twitter' | 'others'): void {
    const event: AnalyticsEvent<ShareItem> = {
      name: ANALYTICS_EVENT_NAMES.ShareItem,
      eventType: ANALYTIC_EVENT_TYPES.Social,
      attributes: {
        itemId: this.item.id,
        categoryId: this.item.categoryId,
        channel: channel,
        screenId: SCREEN_IDS.ItemDetail,
        isPro: this.user.featured,
        salePrice: this.item.salePrice,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
