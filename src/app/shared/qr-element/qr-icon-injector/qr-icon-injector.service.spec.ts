import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { QrIconInjectorService } from './qr-icon-injector.service';

describe('QrIconInjectorService', () => {
  let service: QrIconInjectorService;
  let windowMock;
  let mutationObserverMock;
  let mockData;

  mockData = {
    elementNode: '<div></div>',
    iconSize: { width: 100, height: 100 },
    iconPath: 'path/to/icon.png',
  };

  mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn();
    this.trigger = (mockedMutationList) => {
      callback(mockedMutationList, this);
    };
  });

  beforeEach(async () => {
    windowMock = {
      MutationObserver: mutationObserverMock,
    };

    global.MutationObserver = mutationObserverMock;

    await TestBed.configureTestingModule({
      providers: [
        QrIconInjectorService,
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });

    service = TestBed.inject(QrIconInjectorService);
  });

  describe('when mutation exists in window and there are no instances of mutation observer', () => {
    it('should create the instance and observe the target', () => {
      service.injectLogo(mockData.elementNode, mockData.iconSize, mockData.iconPath);
      const [observerInstance] = mutationObserverMock.mock.instances;

      expect(observerInstance).toBeDefined();
      expect(observerInstance.observe).toHaveBeenCalled();
    });
  });

  describe('when mutation does not exist in window', () => {
    it('should not create the instance', () => {
      windowMock.MutationObserver = undefined;
      mutationObserverMock.mockClear();

      service.injectLogo(mockData.elementNode, mockData.iconSize, mockData.iconPath);
      const [observerInstance] = mutationObserverMock.mock.instances;

      expect(observerInstance).not.toBeDefined();
    });
  });
});
