import { Inject, Injectable } from '@angular/core';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
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
    const { modalWidth, modalHeight } = this.externalProviderModalSize;

    return {
      isJavaEnabled: this.isJavaEnabled,
      isJavaScriptEnabled: true,
      language: this.language,
      colorDepth: this.screen.colorDepth,
      modalWidth,
      modalHeight,
      timeZoneOffset: this.timeZoneOffset,
      userAgent: this.userAgent,
    };
  }

  //FIXME: This should not be hardcoded and retrieved by rendering the modal and then getting the sizes. For now, copying and hardcoding same modal SCSS values
  public get externalProviderModalSize(): { modalWidth: number; modalHeight: number } {
    const lgBreakpoint: string = '991px';
    const maxWidth: number = 720;

    const modalHeaderHeight: number = 56;
    let modalWidth: number = this.window.innerWidth * 0.8;
    let modalHeight: number = 630 - modalHeaderHeight;

    if (modalHeight > maxWidth) {
      modalHeight = maxWidth;
    }

    const isScreenLgOrLess: boolean = this.window.matchMedia(`(max-width: ${lgBreakpoint})`).matches;
    if (isScreenLgOrLess) {
      modalWidth = this.window.innerWidth;
      modalHeight = this.window.innerHeight - modalHeaderHeight;
    }

    return {
      modalWidth,
      modalHeight,
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
