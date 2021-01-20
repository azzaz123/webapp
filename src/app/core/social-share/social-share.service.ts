import { Injectable } from '@angular/core';

const FACEBOOK_URL =
  'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&';
const TWITTER_URL = 'https://twitter.com/intent/tweet?';
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
  public twitterShare(url: string, text?: string): void {
    const params: URLSearchParams = new URLSearchParams();
    params.set('url', url);

    if (text) {
      params.set('text', text);
    }

    window.open(TWITTER_URL + params.toString(), TWITTER_NAME, TWITTER_PARAMS);
  }

  public facebookShare(url: string): void {
    const params: URLSearchParams = new URLSearchParams();
    params.set('href', url);

    window.open(
      FACEBOOK_URL + params.toString(),
      FACEBOOK_NAME,
      FACEBOOK_PARAMS
    );
  }
}
