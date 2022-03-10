import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WindowMessage } from '@core/window-message/interfaces/window-message.interface';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';

import { ProcessCompleteComponent } from './process-complete.component';

describe('ProcessCompleteComponent', () => {
  let component: ProcessCompleteComponent;
  let fixture: ComponentFixture<ProcessCompleteComponent>;
  let injectedWindow: Window;
  let windowMessageService: WindowMessageService;
  let mockParamIdValue: string = null;

  const MOCK_ID: string = '1234';
  const MOCK_WINDOW_MESSAGE: WindowMessage = { id: MOCK_ID };
  const MOCK_ORIGIN: string = environment.baseUrl;
  const MOCK_WINDOW: Partial<Window> = {
    close: () => {},
    origin: MOCK_ORIGIN,
    opener: null,
  };
  const MOCK_WINDOW_OPENER: Partial<Window> = { ...MOCK_WINDOW };

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

    fixture.detectChanges();

    spyOn(injectedWindow, 'close');
    spyOn(windowMessageService, 'send');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when displaying component', () => {
    describe('and when no ID is present in URL', () => {
      beforeEach(() => {
        mockParamIdValue = null;

        component.ngOnInit();
      });

      it('should close the current browser window', () => {
        expect(injectedWindow.close).toHaveBeenCalledTimes(1);
      });

      it('should not send message', () => {
        expect(windowMessageService.send).not.toHaveBeenCalled();
      });
    });

    describe('and when ID is present in URL', () => {
      beforeEach(() => {
        mockParamIdValue = MOCK_ID;
      });

      describe('and when the window was NOT opened by another window', () => {
        beforeEach(() => {
          component.ngOnInit();
        });

        it('should close the current browser window', () => {
          expect(injectedWindow.close).toHaveBeenCalledTimes(1);
        });

        it('should not send message', () => {
          expect(windowMessageService.send).not.toHaveBeenCalled();
        });
      });

      describe('and when the window was opened by another window', () => {
        beforeEach(() => {
          injectedWindow.opener = MOCK_WINDOW_OPENER as Window;

          component.ngOnInit();
        });

        it('should send message', () => {
          expect(windowMessageService.send).toHaveBeenCalledTimes(1);
          expect(windowMessageService.send).toHaveBeenCalledWith(MOCK_WINDOW_MESSAGE);
        });

        it('should close the current browser window', () => {
          expect(injectedWindow.close).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
