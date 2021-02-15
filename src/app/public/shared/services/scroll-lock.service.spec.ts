import { TestBed } from '@angular/core/testing';

import { ScrollLockService } from './scroll-lock.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

describe('ScrollLockService', () => {
  let service: ScrollLockService;
  let window: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollLockService],
    });
    service = TestBed.inject(ScrollLockService);
    window = TestBed.inject(WINDOW_TOKEN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When lock called', () => {
    it('should call changeLockStatus', () => {
      spyOn(service, 'changeLockStatus');
      service.lock();

      expect(service.changeLockStatus).toHaveBeenCalledTimes(1);
      expect(service.changeLockStatus).toHaveBeenCalledWith(true);
    });
  });

  describe('When unlock called', () => {
    it('should call changeLockStatus', () => {
      spyOn(service, 'changeLockStatus');
      service.unlock();

      expect(service.changeLockStatus).toHaveBeenCalledTimes(1);
      expect(service.changeLockStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('When changeLockStatus called', () => {
    describe('to lock', () => {
      it('should set body overflow to hidden', () => {
        service.changeLockStatus(true);

        expect(window.document.body.style.overflow).toBe('hidden');
      });
    });

    describe('to unlock', () => {
      it('should set body overflow to unset', () => {
        service.changeLockStatus(false);

        expect(window.document.body.style.overflow).toBe('unset');
      });
    });
  });
});
