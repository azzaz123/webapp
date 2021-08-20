import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LottieService } from './lottie.service';

const mockLottiePlayerCallback = jest.fn();
class MockLottiePlayer {
  private count = 0;
  constructor(fakeCallback: () => {}) {
    fakeCallback();
  }

  public loadAnimation() {
    this.count++;
  }

  public get counters() {
    return this.count;
  }
}
const mockLottiePlayer = new MockLottiePlayer(mockLottiePlayerCallback);
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

  describe('when retrieving the Lottie SDK', () => {
    it('should retrieve the SDK', fakeAsync(() => {
      let lottiePlayer = null;

      service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
      tick();
      lottiePlayer.loadAnimation();

      expect(lottiePlayer).toEqual(mockLottiePlayer);
      expect(mockLottiePlayerCallback).toHaveBeenCalledTimes(1);
      expect(lottiePlayer.counters).toEqual(1);
    }));

    describe('and when retrieving again the Lottie SDK', () => {
      it('should use the cached SDK reference', fakeAsync(() => {
        let lottiePlayer = null;

        service.lottiePlayer$.subscribe((library) => (lottiePlayer = library));
        tick();
        lottiePlayer.loadAnimation();

        expect(lottiePlayer).toEqual(mockLottiePlayer);
        expect(mockLottiePlayerCallback).toHaveBeenCalledTimes(1);
        expect(lottiePlayer.counters).toEqual(2);
      }));
    });
  });
});
