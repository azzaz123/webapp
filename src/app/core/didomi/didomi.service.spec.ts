import { TestBed } from '@angular/core/testing';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { of } from 'rxjs';
import { WINDOW_TOKEN } from './../window/window.token';
import { DidomiUserConsents } from './didomi.interface';
import { DidomiService } from './didomi.service';

class DidomiStub {
  callback: (event: any) => any;

  getUserConsentStatusForPurpose(purpouseKey: string): boolean {
    return true;
  }

  getUserConsentStatusForVendor(vendorKey: string): boolean {
    return true;
  }

  getUserConsentStatusForAll(): DidomiUserConsents {
    return {
      purposes: { enabled: [], disabled: [] },
    };
  }

  on(event: string, callback: (event: any) => any): void {
    this.callback = callback;
  }

  makeCallback(): void {
    this.callback('');
  }
}

describe('Service: Didomi', () => {
  let service: DidomiService;
  let loadExternalLibsServiceMock;
  const windowMock: Window = <any>{
    Didomi: null,
    didomiOnReady: [],
  };
  const didomiStub = new DidomiStub();

  beforeEach(() => {
    loadExternalLibsServiceMock = {
      loadScriptByText: () => {
        windowMock['Didomi'] = didomiStub;
        windowMock['didomiOnReady'][0]();
        return of(null);
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
        {
          provide: LoadExternalLibsService,
          useValue: loadExternalLibsServiceMock,
        },
        DidomiService,
      ],
    });

    service = TestBed.inject(DidomiService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('userAllowedSegmentationInAds', () => {
    it('should load didomi lib if not loaded yet', () => {
      service.userAllowedSegmentationInAds$().subscribe(() => {
        expect(loadExternalLibsServiceMock.loadScriptByText).toHaveBeenCalled();
      });
    });

    it('should return not allowed on the init', () => {
      service.userAllowedSegmentationInAds$().subscribe((allowed: boolean) => {
        expect(allowed).toBeFalsy();
      });
    });

    it('should update value if the user change the consent', () => {
      service.userAllowedSegmentationInAds$().subscribe((allowed: boolean) => {
        expect(allowed).toBeTruthy();
      });
      setTimeout(() => {
        windowMock['Didomi'].makeCallback();
      }, 1000);
    });

    it('should block when user disallowed consent', () => {
      spyOn(didomiStub, 'getUserConsentStatusForVendor').and.returnValue(false);

      service.userAllowedSegmentationInAds$().subscribe((allowed: boolean) => {
        expect(allowed).toBeFalsy();
      });
    });

    it('should block when user disable purposes', () => {
      spyOn(didomiStub, 'getUserConsentStatusForAll').and.returnValue({
        purposes: { enabled: [], disabled: ['ads', 'search ads'] },
      });

      service.userAllowedSegmentationInAds$().subscribe((allowed: boolean) => {
        expect(allowed).toBeFalsy();
      });
    });

    it('should allow when user enable purposes and consent', () => {
      spyOn(didomiStub, 'getUserConsentStatusForVendor').and.returnValue(true);
      spyOn(didomiStub, 'getUserConsentStatusForAll').and.returnValue({
        purposes: { enabled: [], disabled: [] },
      });

      service.userAllowedSegmentationInAds$().subscribe((allowed: boolean) => {
        expect(allowed).toBeTruthy();
      });
    });
  });
});
