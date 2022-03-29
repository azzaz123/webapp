import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { LoadExternalLibsService } from './load-external-libs.service';

class ScriptElementStub {
  type: string;
  src: string;
  async: boolean;
  defer: boolean;
  onload: () => void;
  onerror: () => void;

  constructor(fakeError = false) {
    setTimeout(() => {
      if (fakeError) {
        return this.onerror();
      }
      this.onload();
    }, 100);
  }
}

const TextScriptMock = `
  (function(window) {
    window.scriptLoaded = true
  })(window)
`;

const externalSourceUrl = 'http://external-lib.com/js';

describe('LoadExternalLibService', () => {
  let service: LoadExternalLibsService;

  let documentCreateElementSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadExternalLibsService],
    });
    service = TestBed.inject(LoadExternalLibsService);
    documentCreateElementSpy = spyOn(document, 'createElement').and.returnValue(new ScriptElementStub());

    spyOn(document.body, 'appendChild');
  });

  it('should create an script with a observable complete', fakeAsync((doneCallback) => {
    const observable: Observable<void> = service.loadScriptBySource('http://external-lib.com/js');

    observable.subscribe(() => {
      doneCallback();
    });
    tick();
  }));

  it('should create a list of scripts with a observable complete', fakeAsync((doneCallback) => {
    const observable: Observable<void> = service.loadScriptBySource([
      'http://external-lib.com/js',
      'http://external-lib.com/js2',
      'http://external-lib.com/js3',
    ]);

    observable.subscribe(() => {
      doneCallback();
    });
    tick();
  }));

  it('should cache observable of the libs', () => {
    service.loadScriptBySource(externalSourceUrl).subscribe();
    service.loadScriptBySource(externalSourceUrl).subscribe();

    expect(document.createElement).toHaveBeenCalledTimes(1);
  });

  it('should create a script with text script', () => {
    service.loadScriptByText('textScript', TextScriptMock).subscribe();

    expect(document.createElement).toHaveBeenCalled();
  });

  it('should cache script with text script if we called twice', () => {
    service.loadScriptByText('textScript', TextScriptMock).subscribe();
    service.loadScriptByText('textScript', TextScriptMock).subscribe();

    expect(document.createElement).toHaveBeenCalledTimes(1);
  });

  describe('when script fails loading', () => {
    beforeEach(() => {
      documentCreateElementSpy.and.callFake(() => new ScriptElementStub(true));
    });

    it('should notify error', fakeAsync(() => {
      const expectedError = new Error(`Error loading script with source ${externalSourceUrl}`);

      expect(() => {
        service.loadScriptBySource(externalSourceUrl).subscribe();
        tick(200);
      }).toThrowError(expectedError);
    }));
  });
});
