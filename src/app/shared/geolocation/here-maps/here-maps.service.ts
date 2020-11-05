/**
 * This service adds necessary elements to <head> to let Here Maps work
 * Also, it does this process in sequence to let the library load correctly
 *
 * "Weird" solution, but allows us to add Here Maps just once and when we need it
 *
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const HERE_MAPS_VERSION = '3.0';
export const HERE_MAPS_CORE_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-core.js`;
export const HERE_MAPS_SERVICE_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-service.js`;
export const HERE_MAPS_UI_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-ui.js`;
export const HERE_MAPS_UI_CSS_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-ui.css`;
export const HERE_MAPS_EVENTS_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-mapevents.js`;

export const HERE_MAPS_CORE_REF_ID = 'src-here-maps-core';
export const HERE_MAPS_SERVICE_REF_ID = 'src-here-maps-service';
export const HERE_MAPS_UI_REF_ID = 'src-here-maps-ui';
export const HERE_MAPS_UI_CSS_REF_ID = 'src-here-maps-ui-css';
export const HERE_MAPS_EVENTS_REF_ID = 'src-here-maps-events';

export const GEO_APP_ID = 'RgPrXX1bXt123UgUFc7B';
export const GEO_APP_CODE = 'HtfX0DsqZ2Y0x-44GfujFA';


export const CHECK_INTERVAL_MS = 100;

@Injectable({
  providedIn: 'root'
})
export class HereMapsService {

  public platform: H.service.Platform;

  public isLibraryReady = false;
  public isLibraryReady$ = new Subject<boolean>();

  constructor() {
    this.appendCoreToDOM();
    this.checkCore();
  }

  private checkCore() {
    const checkInterval = setInterval(() => {
      const coreLoaded = window['H'];

      if (!coreLoaded) {
        return;
      }

      clearInterval(checkInterval);
      this.appendServiceToDOM();
      this.checkService();

    }, CHECK_INTERVAL_MS);
  }

  private checkService() {
    const checkService = setInterval(() => {
      const serviceLoaded = H.service;

      if (!serviceLoaded) {
        return;
      }

      clearInterval(checkService);
      this.appendUICSStoDOM();
      this.appendUIToDOM();
      this.appendEventsToDOM();
      this.checkLibrary();
    }, CHECK_INTERVAL_MS);
  }

  private checkLibrary() {
    const checkLib = setInterval(() => {
      const isLoadedUI = H.ui;
      const isLoadedEvents = H.mapevents;

      if (!(isLoadedUI && isLoadedEvents)) {
        return;
      }

      clearInterval(checkLib);
      this.initializePlatform();
      this.isLibraryReady = true;
      this.isLibraryReady$.next(this.isLibraryReady);
    });
  }

  private initializePlatform() {
    this.platform = new H.service.Platform({
      app_id: GEO_APP_ID,
      app_code: GEO_APP_CODE,
      useCIT: true,
      useHTTPS: true
    });
  }

  private appendCoreToDOM() {
    const coreScriptRef = document.getElementById(HERE_MAPS_CORE_REF_ID);
    if (coreScriptRef) {
      return;
    }

    console.log('test')


    const coreScript = document.createElement('script');
    coreScript.setAttribute('id', HERE_MAPS_CORE_REF_ID);
    coreScript.setAttribute('src', HERE_MAPS_CORE_URL);
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.setAttribute('charset', 'utf-8');
    document.head.appendChild(coreScript);
  }

  private appendServiceToDOM() {
    const serviceScriptRef = document.getElementById(HERE_MAPS_SERVICE_REF_ID);

    if (serviceScriptRef) {
      return;
    }

    const serviceScript = document.createElement('script');
    serviceScript.setAttribute('id', HERE_MAPS_SERVICE_REF_ID);
    serviceScript.setAttribute('src', HERE_MAPS_SERVICE_URL);
    serviceScript.setAttribute('type', 'text/javascript');
    serviceScript.setAttribute('charset', 'utf-8');
    document.head.appendChild(serviceScript);
  }

  private appendUIToDOM() {
    const uiScriptRef = document.getElementById(HERE_MAPS_UI_REF_ID);

    if (uiScriptRef) {
      return;
    }

    const uiScript = document.createElement('script');
    uiScript.setAttribute('id', HERE_MAPS_UI_REF_ID);
    uiScript.setAttribute('src', HERE_MAPS_UI_URL);
    uiScript.setAttribute('type', 'text/javascript');
    uiScript.setAttribute('charset', 'utf-8');

    document.head.appendChild(uiScript);
  }

  private appendUICSStoDOM() {
    const uiCssRef = document.getElementById(HERE_MAPS_UI_CSS_REF_ID);

    if (uiCssRef) {
      return;
    }

    const uiCss = document.createElement('link');
    uiCss.setAttribute('id', HERE_MAPS_UI_CSS_REF_ID);
    uiCss.setAttribute('href', HERE_MAPS_UI_CSS_URL);
    uiCss.setAttribute('type', 'text/css');
    uiCss.setAttribute('rel', 'stylesheet');

    document.head.appendChild(uiCss);
  }

  private appendEventsToDOM() {
    const eventsRef = document.getElementById(HERE_MAPS_EVENTS_REF_ID);

    if (eventsRef) {
      return;
    }

    const eventsScript = document.createElement('script');
    eventsScript.setAttribute('id', HERE_MAPS_EVENTS_REF_ID);
    eventsScript.setAttribute('src', HERE_MAPS_EVENTS_URL);
    eventsScript.setAttribute('type', 'text/javascript');
    eventsScript.setAttribute('charset', 'utf-8');

    document.head.appendChild(eventsScript);
  }

}
