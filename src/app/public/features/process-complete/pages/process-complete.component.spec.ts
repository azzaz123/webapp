import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WINDOW_MESSAGE_TYPE } from '@core/window-message/enums/window-message-type.enum';
import { WindowMessage } from '@core/window-message/interfaces/window-message.interface';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

import { ProcessCompleteComponent } from './process-complete.component';

describe('ProcessCompleteComponent', () => {
  let component: ProcessCompleteComponent;
  let fixture: ComponentFixture<ProcessCompleteComponent>;
  let injectedWindow: Window;
  let windowMessageService: WindowMessageService;
  let mockParamIdValue: string = null;

  const MOCK_WINDOW_MESSAGE: WindowMessage = { type: WINDOW_MESSAGE_TYPE.PROCESS_COMPLETE };
  const MOCK_WINDOW: Partial<Window> = {
    close: () => {},
    get parent() {
      return null;
    },
  };
  const MOCK_WINDOW_PARENT: Window = { ...MOCK_WINDOW } as Window;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (_key) => mockParamIdValue } } },
        },
        {
          provide: WINDOW_TOKEN,
          useValue: MOCK_WINDOW,
        },
        {
          provide: WindowMessageService,
          useValue: { send: () => {} },
        },
      ],
      declarations: [ProcessCompleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCompleteComponent);
    component = fixture.componentInstance;
    injectedWindow = TestBed.inject(WINDOW_TOKEN);
    windowMessageService = TestBed.inject(WindowMessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when displaying component', () => {
    beforeEach(() => {
      spyOn(windowMessageService, 'send');
      spyOn(injectedWindow, 'close');

      component.ngOnInit();
    });

    it('should send process complete message to current browser window', () => {
      expect(windowMessageService.send).toHaveBeenCalledTimes(1);
      expect(windowMessageService.send).toHaveBeenCalledWith(MOCK_WINDOW_MESSAGE, MOCK_WINDOW);
    });

    it('should close the current browser window', () => {
      expect(injectedWindow.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('when displaying component in a window that has parent', () => {
    beforeEach(() => {
      spyOn(windowMessageService, 'send');
      spyOn(injectedWindow, 'close');
      jest.spyOn(MOCK_WINDOW, 'parent', 'get').mockReturnValue(MOCK_WINDOW_PARENT);

      component.ngOnInit();
    });

    it('should send process complete message to self and parent', () => {
      expect(windowMessageService.send).toHaveBeenCalledTimes(2);
      expect(windowMessageService.send).toHaveBeenCalledWith(MOCK_WINDOW_MESSAGE, MOCK_WINDOW);
      expect(windowMessageService.send).toHaveBeenCalledWith(MOCK_WINDOW_MESSAGE, MOCK_WINDOW_PARENT);
    });

    it('should close the current browser window', () => {
      expect(injectedWindow.close).toHaveBeenCalledTimes(1);
    });
  });
});
