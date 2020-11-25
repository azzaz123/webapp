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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useFactory: () => new DocumentStub(),
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
});
