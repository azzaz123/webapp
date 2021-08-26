import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockLottiePlayer } from '@fixtures/lottie.fixtures.spec';

import { LottieService } from './lottie.service';

const mockLottiePlayerConstructorCallback = jest.fn();
const mockLottiePlayer = new MockLottiePlayer(mockLottiePlayerConstructorCallback);
jest.mock('lottie-web', () => ({
  __esModule: true,
  default: mockLottiePlayer,
  namedExport: 'LottiePlayer',
}));

describe('LottieService', () => {
  let service: LottieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LottieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when retrieving the Lottie library', () => {
    it('should retrieve the library from browser', fakeAsync(() => {
      let lottiePlayer = null;

      service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
      tick();

      expect(lottiePlayer).toEqual(mockLottiePlayer);
      expect(mockLottiePlayerConstructorCallback).toHaveBeenCalledTimes(1);
    }));
  });

  describe('when Lottie library was already requested and therefore is in cache', () => {
    beforeEach(() => service.lottiePlayer$.subscribe());

    it('should retrieve the library only once from browser and use cached one', fakeAsync(() => {
      let lottiePlayer = null;

      service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
      tick();

      expect(lottiePlayer).toEqual(mockLottiePlayer);
      expect(mockLottiePlayerConstructorCallback).toHaveBeenCalledTimes(1);
    }));
  });
});
