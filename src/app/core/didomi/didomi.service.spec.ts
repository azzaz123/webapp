import { TestBed } from '@angular/core/testing';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { of } from 'rxjs';
import { WINDOW_TOKEN } from './../window/window.token';
import { DidomiService } from './didomi.service';

class DidomiStub {
  callback: (event: any) => any;

  getUserConsentStatusForPurpose(purpouseKey: string) {
    return true;
  }

  getUserConsentStatusForVendor(vendorKey: string) {
    return true;
  }

  getUserConsentStatusForAll() {
    return {
      purposes: { enabled: [], disabled: [] },
    };
  }

  on(event: string, callback: (event: any) => any): void {
    console.log('event', event);
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

  beforeEach(() => {
    loadExternalLibsServiceMock = {
      loadScriptByText: () => {
        windowMock['Didomi'] = new DidomiStub();
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

    it('should return inialize not allowed', () => {
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
  });
});
