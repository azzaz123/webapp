import { AnimationConfigWithPath, AnimationEventName } from 'lottie-web';
import { of, Subject } from 'rxjs';

export class MockLottiePlayer {
  public static MOCK_LOTTIE_CONTAINER_CLASS = 'lottieContainer';

  public eventQueue = [];
  public animationDestroyed$ = new Subject();

  constructor(callback?: () => {}) {
    if (callback) {
      callback();
    }
  }

  public loadAnimation(config: AnimationConfigWithPath) {
    const addEventListener = (animationEventName: AnimationEventName, callBack: () => {}) => {
      this.eventQueue.push({ animationEventName, callBack });
    };

    config.container.setAttribute('class', MockLottiePlayer.MOCK_LOTTIE_CONTAINER_CLASS);

    return {
      addEventListener,
      destroy: () => this.animationDestroyed$.next(),
    };
  }

  public triggerEvent(animationEventName: AnimationEventName) {
    this.eventQueue.find((event) => event.animationEventName === animationEventName)?.callBack();
  }
}

export const MockLottieService = (mockLottiePlayerInstance: MockLottiePlayer) => {
  return {
    lottiePlayer$: of(mockLottiePlayerInstance),
  };
};
