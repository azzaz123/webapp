import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { TcfApi } from './tcf.interface';

@Injectable({
  providedIn: 'root',
})
export class TcfService {
  private static NAME_LIB = '__tcfapi';

  public get tcfApi(): TcfApi {
    return this.window[TcfService.NAME_LIB];
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}
}
