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
  HERE_MAPS_SERVICE_LEGACY_REF_ID,
  HERE_MAPS_SERVICE_LEGACY_URL,
  HERE_MAPS_SERVICE_REF_ID,
  HERE_MAPS_SERVICE_URL,
  RETRY_AMOUNT,
} from './here-maps.service';

describe('HereMapsService', () => {
  let service: HereMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HereMapsService] });
    service = TestBed.inject(HereMapsService);
    const scriptIDs = [HERE_MAPS_CORE_REF_ID, HERE_MAPS_SERVICE_REF_ID];
    window['H'] = MOCK_HERE_MAPS;
    scriptIDs.forEach((id) => {
      const ref = document.getElementById(id);
      if (ref) {
        document.head.removeChild(ref);
      }
    });
  });

  describe('when Here Maps has not been loaded', () => {
    it('should add scripts', fakeAsync(() => {
      spyOn(window['H'].service, 'Platform').and.callThrough();
      spyOn(document.head, 'appendChild').and.callThrough();

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

      expect(isLoading).toBeTruthy();
      expect(isReady).toBe(false);

      tick(CHECK_INTERVAL_MS);
      expect(document.head.appendChild).toHaveBeenCalledTimes(1);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreScript);

      tick(CHECK_INTERVAL_MS * 3);
      expect(document.head.appendChild).toHaveBeenCalledTimes(2 * 2);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreScript);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreLegacyScript);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedCoreScript);

      tick(CHECK_INTERVAL_MS * 4);
      expect(window['H'].service.Platform).toHaveBeenCalledTimes(1);
      expect(window['H'].service.Platform).toHaveBeenCalledWith(expectedParams);
      expect(isReady).toBeTruthy();
      expect(isLoading).toBe(false);

      scriptSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    }));
  });

  describe('when Here Maps has been loaded', () => {
    it('should not add any script again', fakeAsync(() => {
      spyOn(window['H'].service, 'Platform').and.callThrough();
      spyOn(document.head, 'appendChild').and.callThrough();

      let isReady: boolean;
      let isLoading: boolean;

      let scriptSubscription = service.initScript().subscribe((value) => {
        isReady = value;
      });

      const loadingSubscription = service.isLibraryLoading$().subscribe((value) => {
        isLoading = value;
      });

      expect(isLoading).toBeTruthy();
      expect(isReady).toBe(false);

      tick(CHECK_INTERVAL_MS * 4);
      expect(isReady).toBeTruthy();
      expect(isLoading).toBe(false);

      loadingSubscription.unsubscribe();

      scriptSubscription = service.initScript().subscribe((value) => {
        isReady = value;
      });

      tick(CHECK_INTERVAL_MS * 8);
      expect(H.service.Platform).toHaveBeenCalledTimes(1);
      expect(document.head.appendChild).toHaveBeenCalledTimes(2);
      expect(isReady).toBeTruthy();
      expect(isLoading).toBe(false);

      scriptSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    }));
  });

  describe('when here Maps fails loading', () => {
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

      tick(CHECK_INTERVAL_MS + CHECK_INTERVAL_MS * RETRY_AMOUNT);
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
