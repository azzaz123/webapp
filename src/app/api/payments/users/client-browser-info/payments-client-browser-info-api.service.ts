import { Inject, Injectable } from '@angular/core';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Observable } from 'rxjs';
import { PaymentsClientBrowserInfoHttpService } from './http/payments-client-browser-info-http.service';

export const EXTERNAL_PROVIDER_MODAL_MAX_LARGE_WIDTH_PX: number = 720;
export const EXTERNAL_PROVIDER_MODAL_HEIGHT_PX: number = 630;
export const EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX: number = 56;
export const EXTERNAL_PROVIDER_MODAL_LARGE_WIDTH_PROPORTION: number = 0.8;

@Injectable({
  providedIn: 'root',
})
export class PaymentsClientBrowserInfoApiService {
  public static EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX = 56;

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
  private get externalProviderModalSize(): { modalWidth: number; modalHeight: number } {
    const lgBreakpoint: string = '991px';

    let modalWidth: number = this.window.innerWidth * EXTERNAL_PROVIDER_MODAL_LARGE_WIDTH_PROPORTION;
    let modalHeight: number = EXTERNAL_PROVIDER_MODAL_HEIGHT_PX - EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX;

    if (modalHeight > EXTERNAL_PROVIDER_MODAL_MAX_LARGE_WIDTH_PX) {
      modalHeight = EXTERNAL_PROVIDER_MODAL_MAX_LARGE_WIDTH_PX.valueOf();
    }

    const isScreenLgOrLess: boolean = this.window.matchMedia(`(max-width: ${lgBreakpoint})`).matches;
    if (isScreenLgOrLess) {
      modalWidth = this.window.innerWidth;
      modalHeight = this.window.innerHeight - EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX;
    }

    modalWidth = Math.round(modalWidth);
    modalHeight = Math.round(modalHeight);

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
