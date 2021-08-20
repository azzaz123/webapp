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
    it('should retrieve the library', fakeAsync(() => {
      let lottiePlayer = null;

      service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
      tick();

      expect(lottiePlayer).toEqual(mockLottiePlayer);
      expect(mockLottiePlayerConstructorCallback).toHaveBeenCalledTimes(1);
    }));

    describe('and when retrieving again the Lottie library', () => {
      it('should use the cached library reference', fakeAsync(() => {
        let lottiePlayer = null;

        service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
        tick();

        expect(lottiePlayer).toEqual(mockLottiePlayer);
        expect(mockLottiePlayerConstructorCallback).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
