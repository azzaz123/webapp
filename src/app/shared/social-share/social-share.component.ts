import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialShareService } from '@core/social-share/social-share.service';
import { SOCIAL_SHARE_CHANNELS } from './enums/social-share-channels.enum';
import { EmailShare } from './interfaces/email-share.interface';
import { FacebookShare } from './interfaces/facebook-share.interface';
import { TwitterShare } from './interfaces/twitter-share.interface';

@Component({
  selector: 'tsl-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent {
  @Input() title: string;
  @Input() facebook: FacebookShare;
  @Input() twitter: TwitterShare;
  @Input() email: EmailShare;
  @Output() socialMediaChannel: EventEmitter<string> = new EventEmitter();

  constructor(private socialShareService: SocialShareService) {}

  public facebookShare(): void {
    this.socialShareService.facebookShare(this.facebook.url);
    this.socialMediaChannel.emit(SOCIAL_SHARE_CHANNELS.FACEBOOK);
  }

  public twitterShare(): void {
    this.socialShareService.twitterShare(this.twitter.url, this.twitter.text);
    this.socialMediaChannel.emit(SOCIAL_SHARE_CHANNELS.TWITTER);
  }

  public emailShare(): void {
    this.socialShareService.emailShare(this.email.url, this.email.subject, this.email.message);
    this.socialMediaChannel.emit(SOCIAL_SHARE_CHANNELS.EMAIL);
  }
}
