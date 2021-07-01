import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceService } from '@core/device/device.service';
import { environment } from '@environments/environment';
import { APP_LOCALE } from 'configs/subdomains.config';

export const LANGUAGE_HEADER_NAME = 'Accept-Language';
export const MIN_QUALITY_VALUE = 0.1;

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private deviceService: DeviceService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isMonolithRequest = request.url.startsWith(environment.baseUrl);
    const isLanguageHeaderPresent = request.headers.has(LANGUAGE_HEADER_NAME);
    const needsLanguageHeader = isMonolithRequest && !isLanguageHeaderPresent;

    if (needsLanguageHeader) {
      const setHeaders = {
        [LANGUAGE_HEADER_NAME]: this.getLanguageHeaderValue(),
      };

      request = request.clone({ setHeaders });
    }

    return next.handle(request);
  }

  private getLanguageHeaderValue(): string {
    const browserLanguages = this.getBrowserLanguagesWithoutCurrentLocale();
    const browserLanguagesWithQualityValue = browserLanguages.map(this.formatLanguageWithQuality);

    const allLanguagesWithQualityValues = [`${this.locale}`, ...browserLanguagesWithQualityValue];
    return `${allLanguagesWithQualityValues.join(',')}`;
  }

  private formatLanguageWithQuality(language: string, index: number): string {
    const qualityForCurrentIndex = index * 0.1;

    let quality = 1 - qualityForCurrentIndex - 0.1;
    if (quality < MIN_QUALITY_VALUE) {
      quality = MIN_QUALITY_VALUE;
    }

    return `${language};q=${quality.toFixed(1)}`;
  }

  private getBrowserLanguagesWithoutCurrentLocale(): string[] {
    return this.deviceService.getDeviceLanguages().filter((language) => language !== this.locale);
  }
}
