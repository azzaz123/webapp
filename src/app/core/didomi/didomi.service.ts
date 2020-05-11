import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DIDOMI_EMBED } from './didomi-embed-script';

@Injectable()
export class DidomiService {

  public isReady = false;
  public isReady$: Subject<boolean> = new Subject<boolean>();
  public library: any = null;

  public initialize() {
    const coreScript: HTMLScriptElement = document.createElement('script');
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.text = DIDOMI_EMBED;
    coreScript.onload = () => this.isReady$.next(true);
    document.head.appendChild(coreScript);

    this.checkIfReady();
  }

  private checkIfReady() {
    const checkInterval = setInterval(() => {
      if (window['Didomi']) {
        this.library = Didomi;
        this.isReady = true;
        this.isReady$.next(this.isReady);
        clearInterval(checkInterval);
      }
    }, 100);
  }

}
