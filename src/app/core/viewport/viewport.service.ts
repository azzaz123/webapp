import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {
  Viewport,
  viewports,
  ViewportType,
} from '@core/viewport/viewport.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Injectable()
export class ViewportService {
  private _onWidthChange: ReplaySubject<number> = new ReplaySubject(1);
  private _onViewportChange: ReplaySubject<ViewportType> = new ReplaySubject(1);
  private currentViewport: ViewportType;

  get onWidthChange(): Observable<number> {
    return this._onWidthChange.asObservable();
  }

  get onViewportChange(): Observable<ViewportType> {
    return this._onViewportChange.asObservable();
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {
    this.window.addEventListener('resize', this.onResize.bind(this));

    this.onWidthChange.subscribe((width) => {
      const calculatedViewport = this.calculateViewport(width).type;
      if (calculatedViewport !== this.currentViewport) {
        this.currentViewport = calculatedViewport;
        this._onViewportChange.next(this.currentViewport);
      }
    });

    // Needed for first render
    this.onResize();
  }

  private calculateViewport(width: number): Viewport {
    return viewports.reduce(
      (currentViewport, nextViewport) => {
        return this.canBeViewport(width, nextViewport)
          ? this.getBiggestViewport(currentViewport, nextViewport)
          : currentViewport;
      },
      viewports.find((viewport) => viewport.type === ViewportType.XS)
    );
  }

  private onResize(): void {
    this._onWidthChange.next(this.window.innerWidth);
  }

  private getBiggestViewport(...viewports: Viewport[]): Viewport {
    return viewports.reduce((currentViewport, nextViewport) => {
      if (currentViewport) {
        return currentViewport.minWidth >= nextViewport.minWidth
          ? currentViewport
          : nextViewport;
      } else {
        return nextViewport;
      }
    });
  }

  private canBeViewport(width: number, viewport: Viewport): boolean {
    return viewport.minWidth <= width;
  }
}
