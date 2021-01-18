import { ViewportService } from '@core/viewport/viewport.service';
import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { ViewportType } from '@core/viewport/viewport.enum';

describe('ViewportService', () => {
  let viewportService: ViewportService;
  let windowMock: Window;
  let resizeCallback: Function;
  let innerWidth: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WINDOW_TOKEN,
          useValue: {
            get innerWidth(): number {
              return innerWidth;
            },
            addEventListener: (key: 'resize', callback) => {
              resizeCallback = callback;
            },
          },
        },
      ],
    });

    innerWidth = 0;
    windowMock = TestBed.inject(WINDOW_TOKEN);
    viewportService = TestBed.inject(ViewportService);
  });

  describe('When a new subscriber appears...', () => {
    it('should emit latest width', () => {
      const callback = jest.fn();
      viewportService.$onWidthChange.subscribe(callback);

      expect(callback).toBeCalledWith(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    it('should emit latest viewport', () => {
      const callback = jest.fn();
      viewportService.$onViewportChange.subscribe(callback);

      expect(callback).toBeCalledWith(ViewportType.XS);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('When window resizes...', () => {
    it('should emit the new window width to listeners', () => {
      expectWidthToBeEmitted(200);
    });
  });

  describe('When window viewport changes to...', () => {
    describe('viewport XS', () => {
      it('should emit the XS viewport', () => {
        expectViewportToBeEmitted(0, ViewportType.XS);
      });
    });

    describe('viewport SM', () => {
      it('should emit the SM viewport', () => {
        expectViewportToBeEmitted(576, ViewportType.SM);
      });
    });

    describe('viewport MD', () => {
      it('should emit the MD viewport', () => {
        expectViewportToBeEmitted(768, ViewportType.MD);
      });
    });

    describe('viewport LG', () => {
      it('should emit the LG viewport', () => {
        expectViewportToBeEmitted(992, ViewportType.LG);
      });
    });

    describe('viewport XL', () => {
      it('should emit the XL viewport', () => {
        expectViewportToBeEmitted(1200, ViewportType.XL);
      });
    });

    describe('viewport XXL', () => {
      it('should emit the XXL viewport', () => {
        expectViewportToBeEmitted(1400, ViewportType.XXL);
      });
    });
  });

  function expectWidthToBeEmitted(width: number): void {
    const widthChangeHandler = jest.fn();
    viewportService.$onWidthChange.subscribe(widthChangeHandler);

    innerWidth = width;
    resizeCallback();

    expect(widthChangeHandler).toHaveBeenCalledWith(innerWidth);
  }

  function expectViewportToBeEmitted(
    width: number,
    viewport: ViewportType
  ): void {
    const viewportChangeHandler = jest.fn();
    viewportService.$onViewportChange.subscribe(viewportChangeHandler);

    innerWidth = width;
    resizeCallback();

    expect(viewportChangeHandler).toHaveBeenCalledWith(viewport);
  }
});
