import { Injectable } from '@angular/core';

const FACEBOOK_URL =
  'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=';
const TWITTER_URL = 'https://twitter.com/intent/tweet?url=';
const FACEBOOK_NAME = 'fbShareWindow';
const TWITTER_NAME = 'twShareWindow';
const FACEBOOK_PARAMS =
  'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
const TWITTER_PARAMS =
  'height=269, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';

@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  public facebookShare(webLink: string): void {
    const url = FACEBOOK_URL + encodeURIComponent(webLink);
    window.open(url, FACEBOOK_NAME, FACEBOOK_PARAMS);
  }

  public twitterShare(webLink: string): void {
    const url = TWITTER_URL + encodeURIComponent(webLink);
    window.open(url, TWITTER_NAME, TWITTER_PARAMS);
  }
}
