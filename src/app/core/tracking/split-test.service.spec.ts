import { TestBed } from '@angular/core/testing';
import { SplitTestService } from './split-test.service';
import { SplitTestUserInfo } from './split-test.interface';
import { environment } from '../../../environments/environment.docker';

const VARIABLE = 'right';
window['Taplytics'] = jasmine.createSpyObj('Taplytics', ['variable', 'codeBlock', 'identify', 'reset', 'track', 'init']);
window['Taplytics'].variable.and.callFake((name, value, callback) => callback(VARIABLE));
window['Taplytics'].codeBlock.and.callFake((name, callback) => callback());

describe('SplitTestService', () => {

  let service: SplitTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SplitTestService]
    });
    service = TestBed.get(SplitTestService);
  });

  describe('getVariable', () => {
    const NAME = 'position';
    const DEFAULT_VARIABLE = 'left';
    let result: string;

    it('should call Taplytics.variable and return the variable', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);

      service.getVariable(NAME, DEFAULT_VARIABLE).subscribe((value: string) => {
        result = value;
      });

      expect(window['Taplytics'].variable).toHaveBeenCalledWith(NAME, DEFAULT_VARIABLE, jasmine.any(Function));
      expect(result).toBe(VARIABLE);
      expect(sessionStorage.getItem).toHaveBeenCalledWith(NAME);
    });

    it('should set the sessionStorage with the experiment if it doesnt exist', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      spyOn(sessionStorage, 'setItem');

      service.getVariable(NAME, DEFAULT_VARIABLE).subscribe((value: string) => {
        result = value;
      });

      expect(sessionStorage.setItem).toHaveBeenCalledWith(NAME, VARIABLE);
    });

    it('should not set the sessionStorage with the experiment if it exists', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('left');
      spyOn(sessionStorage, 'setItem');

      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getCodeBlock', () => {
    it('should call Taplytics.codeBlock and call callback', () => {
      const NAME = 'position';
      let called: boolean;

      service.getCodeBlock(NAME).subscribe(() => {
        called = true;
      });

      expect(window['Taplytics'].codeBlock).toHaveBeenCalledWith(NAME, jasmine.any(Function));
      expect(called).toBe(true);
    });
  });

  describe('identify', () => {
    it('should call Taplytics.identify', () => {
      const USER_INFO: SplitTestUserInfo = {
        firstName: 'Daniele'
      };

      service.identify(USER_INFO);

      expect(window['Taplytics'].identify).toHaveBeenCalledWith(USER_INFO);
    });
  });

  describe('reset', () => {
    it('should call Taplytics.reset', () => {
      service.reset();

      expect(window['Taplytics'].reset).toHaveBeenCalled();
    });
  });

  describe('track', () => {
    it('should call Taplytics.track', () => {
      const EVENT_NAME = 'name';
      const VALUE = 10;
      const ATTRS = {
        attr: 1
      };

      service.track(EVENT_NAME, VALUE, ATTRS);

      expect(window['Taplytics'].track).toHaveBeenCalledWith(EVENT_NAME, VALUE, ATTRS);
    });
  });

  describe('init', () => {
    it('should call Taplytics.init with the Taplytics API key', () => {
      service.init();

      expect(window['Taplytics'].init).toHaveBeenCalledWith(environment.taplytics);
    });
  });
});
