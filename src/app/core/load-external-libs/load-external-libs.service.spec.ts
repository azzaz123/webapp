import { DOCUMENT } from '@angular/common';
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

class DocumentStub {
  body = {
    appendChild() {},
  };
  createElement(type: string) {
    return new ScriptElementStub();
  }
}

describe('LoadExternalLibService', () => {
  let service: LoadExternalLibsService;
  let documentStub: DocumentStub;

  beforeEach(() => {
    documentStub = new DocumentStub();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: documentStub,
        },
        LoadExternalLibsService,
      ],
    });
    service = TestBed.inject(LoadExternalLibsService);
  });

  it('should create an script with a observable complete', (doneCallback) => {
    const observable: Observable<void> = service.loadScriptBySource('http://external-lib.com/js');

    observable.subscribe(() => {
      doneCallback();
    });
  });

  it('should create a list of scripts with a observable complete', (doneCallback) => {
    const observable: Observable<void> = service.loadScriptBySource([
      'http://external-lib.com/js',
      'http://external-lib.com/js2',
      'http://external-lib.com/js3',
    ]);

    observable.subscribe(() => {
      doneCallback();
    });
  });

  it('should cache observable of the libs', () => {
    spyOn(documentStub, 'createElement').and.returnValue(new ScriptElementStub());

    service.loadScriptBySource(externalSourceUrl).subscribe();
    service.loadScriptBySource(externalSourceUrl).subscribe();

    expect(documentStub.createElement).toHaveBeenCalledTimes(1);
  });

  it('should create a script with text script', () => {
    spyOn(documentStub, 'createElement').and.returnValue(new ScriptElementStub());

    service.loadScriptByText('textScript', TextScriptMock).subscribe();

    expect(documentStub.createElement).toHaveBeenCalled();
  });

  it('should cache script with text script if we called twice', () => {
    spyOn(documentStub, 'createElement').and.returnValue(new ScriptElementStub());

    service.loadScriptByText('textScript', TextScriptMock).subscribe();
    service.loadScriptByText('textScript', TextScriptMock).subscribe();

    expect(documentStub.createElement).toHaveBeenCalledTimes(1);
  });

  describe('when script fails loading', () => {
    it('should notify error', fakeAsync(() => {
      spyOn(documentStub, 'createElement').and.returnValue(new ScriptElementStub(true));
      const expectedError = new Error(`Error loading script with source ${externalSourceUrl}`);

      expect(() => {
        service.loadScriptBySource(externalSourceUrl).subscribe();
        tick(200);
      }).toThrowError(expectedError);
    }));
  });
});
