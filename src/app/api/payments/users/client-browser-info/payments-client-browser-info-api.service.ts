import { Inject, Injectable } from '@angular/core';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import {
  THREE_DOMAIN_SECURE_MODAL_HEIGHT,
  THREE_DOMAIN_SECURE_MODAL_WIDTH,
} from '@api/payments/cards/three-domain-secure/three-domain-secure.constants';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Observable } from 'rxjs';
import { PaymentsClientBrowserInfoHttpService } from './http/payments-client-browser-info-http.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsClientBrowserInfoApiService {
  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private paymentsClientBrowserInfoHttpService: PaymentsClientBrowserInfoHttpService
  ) {}

  public sendBrowserInfo(): Observable<void> {
    return this.paymentsClientBrowserInfoHttpService.put(this.browserInfo);
  }

  private get browserInfo(): PaymentsClientBrowserInfo {
    return {
      isJavaEnabled: this.isJavaEnabled,
      isJavaScriptEnabled: true,
      language: this.language,
      colorDepth: this.screen.colorDepth,
      screenHeight: THREE_DOMAIN_SECURE_MODAL_HEIGHT,
      screenWidth: THREE_DOMAIN_SECURE_MODAL_WIDTH,
      timeZoneOffset: this.timeZoneOffset,
      userAgent: this.userAgent,
    };
  }

  private get isJavaEnabled(): boolean {
    return this.window.navigator.javaEnabled();
  }

  private get language(): string {
    return this.window.navigator.language || (this.window.navigator as Navigator & { userLanguage: string }).userLanguage;
  }

  private get screen(): Screen {
    return this.window.screen;
  }

  private get timeZoneOffset(): string {
    return new Date().getTimezoneOffset().toString();
  }

  private get userAgent(): string {
    return this.window.navigator.userAgent;
  }
}
