import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class ScrollIntoViewService {
  private readonly MOBILE_HEADER_HEIGHT = 65;
  private readonly MOBILE_NAVIGATION_HEIGHT = 69;

  constructor(@Inject(WINDOW_TOKEN) private window: Window, private deviceService: DeviceDetectorService) {}

  public scrollToSelector(selector: string): void {
    this.scrollToElement(this.window.document.querySelector(selector));
  }

  public scrollToElement(element: HTMLElement): void {
    const elementTopPosition = element.getBoundingClientRect().top;
    this.window.document.scrollingElement.scrollTo({
      top: this.deviceService.isDesktop()
        ? elementTopPosition
        : elementTopPosition - this.MOBILE_HEADER_HEIGHT - this.MOBILE_NAVIGATION_HEIGHT,
      behavior: 'smooth',
    });
  }
}
