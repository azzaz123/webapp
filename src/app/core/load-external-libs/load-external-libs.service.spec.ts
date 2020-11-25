import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { LoadExternalLibsService } from './load-external-libs.service';

class ScriptElementStub {
  type: string;
  src: string;
  async: boolean;
  defer: boolean;

  constructor() {
    setTimeout(() => this.onload(), 100);
  }

  onload: () => void;
}

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
    const observable: Observable<void> = service.loadScript(
      'http://external-lib.com/js'
    );

    observable.subscribe(() => {
      doneCallback();
    });
  });

  it('should create a list of scripts with a observable complete', (doneCallback) => {
    const observable: Observable<void> = service.loadScript([
      'http://external-lib.com/js',
      'http://external-lib.com/js2',
      'http://external-lib.com/js3',
    ]);

    observable.subscribe(() => {
      doneCallback();
    });
  });

  it('should cache observable of the libs', () => {
    const source = 'http://external-lib.com/js';
    spyOn(documentStub, 'createElement').and.returnValue(
      new ScriptElementStub()
    );

    service.loadScript(source).subscribe();
    service.loadScript(source).subscribe();

    expect(documentStub.createElement).toHaveBeenCalledTimes(1);
  });
});
