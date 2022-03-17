import { Inject, Injectable } from '@angular/core';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
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
      acceptHeader: this.acceptHeader,
      isJavaEnabled: this.isJavaEnabled,
      isJavaScriptEnabled: true,
      language: this.language,
      colorDepth: this.screen.colorDepth,
      screenHeight: this.screen.height,
      screenWidth: this.screen.width,
      timeZoneOffset: this.timeZoneOffset,
      userAgent: this.userAgent,
    };
  }

  // TODO: This should be collected in backend. For now, hardcode the most common and compatible "Accept" header from browsers
  private get acceptHeader(): string {
    return 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8';
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
