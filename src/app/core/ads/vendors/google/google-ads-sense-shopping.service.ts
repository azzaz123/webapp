import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { AdKeyWords } from './../../models/ad-keyword.interface';

@Injectable({
  providedIn: 'root',
})
export class GoogleAdsSenseShoppingService {
  private get googCsa() {
    return this.window && this.window['_googCsa'];
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  displayShopping(pageOptions: any): void {
    const afshBlocks = { slotId: 'afshcontainer', container: 'afshcontainer', width: 500, height: 400 };
    console.log('displayShopping', { pageOptions, afshBlocks });
    this.googCsa('plas', pageOptions, afshBlocks);
  }
}
