import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_HERE_MAPS } from '../../../../configs/jest/global-mocks.fixtures.spec';
import {
  CHECK_INTERVAL_MS,
  GEO_APP_API_KEY,
  GEO_APP_CODE,
  GEO_APP_ID,
  HereMapsService,
  HERE_MAPS_CORE_LEGACY_REF_ID,
  HERE_MAPS_CORE_LEGACY_URL,
  HERE_MAPS_CORE_REF_ID,
  HERE_MAPS_CORE_URL,
  HERE_MAPS_EVENTS_REF_ID,
  HERE_MAPS_EVENTS_URL,
  HERE_MAPS_SERVICE_LEGACY_REF_ID,
  HERE_MAPS_SERVICE_LEGACY_URL,
  HERE_MAPS_SERVICE_REF_ID,
  HERE_MAPS_SERVICE_URL,
  HERE_MAPS_UI_CSS_REF_ID,
  HERE_MAPS_UI_CSS_URL,
  HERE_MAPS_UI_REF_ID,
  HERE_MAPS_UI_URL,
  RETRY_AMOUNT,
} from './here-maps.service';

describe('HereMapsService', () => {
  let service: HereMapsService;

  const scriptIDs: string[] = [
    HERE_MAPS_CORE_REF_ID,
    HERE_MAPS_CORE_LEGACY_REF_ID,
    HERE_MAPS_SERVICE_REF_ID,
    HERE_MAPS_SERVICE_LEGACY_REF_ID,
    HERE_MAPS_UI_REF_ID,
    HERE_MAPS_UI_CSS_REF_ID,
    HERE_MAPS_EVENTS_REF_ID,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HereMapsService] });
    service = TestBed.inject(HereMapsService);

    window['H'] = MOCK_HERE_MAPS;
    scriptIDs.forEach((id) => {
      const ref = document.getElementById(id);
      if (ref) {
        document.head.removeChild(ref);
      }
    });
  });

  describe('when Here Maps has not been loaded', () => {
    beforeEach(() => {
      spyOn(document.head, 'appendChild').and.callThrough();
      spyOn(document, 'getElementById').and.callThrough();
    });

    it('should add scripts', fakeAsync(() => {
      spyOn(H.service, 'Platform').and.callFake(() => {});

      const expectedCoreScript = document.createElement('script');
      expectedCoreScript.setAttribute('id', HERE_MAPS_CORE_REF_ID);
      expectedCoreScript.setAttribute('src', HERE_MAPS_CORE_URL);
      expectedCoreScript.setAttribute('type', 'text/javascript');
      expectedCoreScript.setAttribute('charset', 'utf-8');

      const expectedCoreLegacyScript = document.createElement('script');
      expectedCoreLegacyScript.setAttribute('id', HERE_MAPS_CORE_LEGACY_REF_ID);
      expectedCoreLegacyScript.setAttribute('src', HERE_MAPS_CORE_LEGACY_URL);
      expectedCoreLegacyScript.setAttribute('type', 'text/javascript');
      expectedCoreLegacyScript.setAttribute('charset', 'utf-8');

      const expectedServiceScript = document.createElement('script');
      expectedServiceScript.setAttribute('id', HERE_MAPS_SERVICE_REF_ID);
      expectedServiceScript.setAttribute('src', HERE_MAPS_SERVICE_URL);
      expectedServiceScript.setAttribute('type', 'text/javascript');
      expectedServiceScript.setAttribute('charset', 'utf-8');

      const expectedServiceLegacyScript = document.createElement('script');
      expectedServiceLegacyScript.setAttribute('id', HERE_MAPS_SERVICE_LEGACY_REF_ID);
      expectedServiceLegacyScript.setAttribute('src', HERE_MAPS_SERVICE_LEGACY_URL);
      expectedServiceLegacyScript.setAttribute('type', 'text/javascript');
      expectedServiceLegacyScript.setAttribute('charset', 'utf-8');

      const expectedServiceUIReadyScript = document.createElement('script');
      expectedServiceUIReadyScript.setAttribute('id', HERE_MAPS_UI_REF_ID);
      expectedServiceUIReadyScript.setAttribute('src', HERE_MAPS_UI_URL);
      expectedServiceUIReadyScript.setAttribute('type', 'text/javascript');
      expectedServiceUIReadyScript.setAttribute('charset', 'utf-8');

      const expectedServiceUICSSReady = document.createElement('link');
      expectedServiceUICSSReady.setAttribute('id', HERE_MAPS_UI_CSS_REF_ID);
      expectedServiceUICSSReady.setAttribute('href', HERE_MAPS_UI_CSS_URL);
      expectedServiceUICSSReady.setAttribute('type', 'text/css');
      expectedServiceUICSSReady.setAttribute('rel', 'stylesheet');

      const expectedServiceEventsReadyScript = document.createElement('script');
      expectedServiceEventsReadyScript.setAttribute('id', HERE_MAPS_EVENTS_REF_ID);
      expectedServiceEventsReadyScript.setAttribute('src', HERE_MAPS_EVENTS_URL);
      expectedServiceEventsReadyScript.setAttribute('type', 'text/javascript');
      expectedServiceEventsReadyScript.setAttribute('charset', 'utf-8');

      const expectedParams = {
        apikey: GEO_APP_API_KEY,
        useCIT: true,
        useHTTPS: true,
      };

      let isReady: boolean;
      let isLoading: boolean;

      const scriptSubscription = service.initScript().subscribe((value) => {
        isReady = value;
      });
      const loadingSubscription = service.isLibraryLoading$().subscribe((value) => {
        isLoading = value;
      });

      tick(CHECK_INTERVAL_MS);
      expect(isLoading).toBe(true);
      expect(isReady).toBe(false);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreScript);

      tick(CHECK_INTERVAL_MS);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreLegacyScript);

      tick(CHECK_INTERVAL_MS * 2);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedServiceScript);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedServiceUIReadyScript);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedServiceUICSSReady);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedServiceEventsReadyScript);

      tick(CHECK_INTERVAL_MS);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedServiceLegacyScript);

      expect(document.head.appendChild).toHaveBeenCalledTimes(scriptIDs.length);

      tick(CHECK_INTERVAL_MS);
      expect(window['H'].service.Platform).toHaveBeenCalledTimes(1);
      expect(window['H'].service.Platform).toHaveBeenCalledWith(expectedParams);
      expect(isReady).toBe(true);
      expect(isLoading).toBe(false);

      scriptSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    }));
  });

  describe('when Here Maps has been loaded', () => {
    beforeEach(fakeAsync(() => {
      spyOn(H.service, 'Platform').and.callFake(() => {});
      service.initScript().subscribe();
      tick(CHECK_INTERVAL_MS * 6); // core time (2 * interval) + others time (2 * interval) + service legacy (1 interval) + new platform (1 interval)
    }));

    it('should not add any script again', fakeAsync(() => {
      spyOn(document.head, 'appendChild').and.callThrough();

      service.initScript().subscribe();
      tick();

      expect(document.head.appendChild).not.toHaveBeenCalled();
    }));
  });

  xdescribe('when here Maps fails loading', () => {
    it('should retry if core script fails', fakeAsync(() => {
      window['H'] = null;
      spyOn(document.head, 'appendChild').and.callThrough();

      let isReady: boolean;
      let isLoading: boolean;

      const scriptSubscription = service.initScript().subscribe((value) => {
        isReady = value;
      });

      const loadingSubscription = service.isLibraryLoading$().subscribe((value) => {
        isLoading = value;
      });

      expect(isLoading).toBeTruthy();
      expect(isReady).toBe(false);

      tick(CHECK_INTERVAL_MS * 6 * RETRY_AMOUNT);
      expect(isReady).toBe(false);
      expect(isLoading).toBe(false);
      expect(document.head.appendChild).toHaveBeenCalledTimes(1 + RETRY_AMOUNT);

      scriptSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    }));

    it('should retry if service script fails', fakeAsync(() => {
      window['H'].service = null;
      spyOn(document.head, 'appendChild').and.callThrough();

      let isReady: boolean;
      let isLoading: boolean;

      const scriptSubscription = service.initScript().subscribe((value) => {
        isReady = value;
      });

      const loadingSubscription = service.isLibraryLoading$().subscribe((value) => {
        isLoading = value;
      });

      expect(isLoading).toBeTruthy();
      expect(isReady).toBe(false);

      tick(CHECK_INTERVAL_MS * 2 + CHECK_INTERVAL_MS + CHECK_INTERVAL_MS * RETRY_AMOUNT);
      expect(isReady).toBe(false);
      expect(isLoading).toBe(false);
      expect(document.head.appendChild).toHaveBeenCalledTimes(1 + 1 + RETRY_AMOUNT);

      scriptSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    }));
  });
});
