import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { WindowMessage } from '../interfaces/window-message.interface';

import { WindowMessageService } from './window-message.service';

import * as rxjs from 'rxjs';
import { WindowMessageWrapper } from '../interfaces/window-message-wrapper.interface';
import { WINDOW_MESSAGE_TYPE } from '../enums/window-message-type.enum';

describe('WindowMessageService', () => {
  let service: WindowMessageService;
  let injectedWindow: Window;

  const MOCK_WINDOW_MESSAGE: WindowMessage = { type: WINDOW_MESSAGE_TYPE.SUCCESS };
  const MOCK_WINDOW_MESSAGE_WRAPPER: WindowMessageWrapper = { payload: MOCK_WINDOW_MESSAGE, fromWallapop: true };
  const MOCK_ALL_ORIGINS = '*';
  const MOCK_WINDOW: Partial<Window> = {
    postMessage: () => {},
    opener: null,
    addEventListener: (_eventName: string) => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WINDOW_TOKEN,
          useValue: MOCK_WINDOW,
        },
      ],
    });
    service = TestBed.inject(WindowMessageService);
    injectedWindow = TestBed.inject(WINDOW_TOKEN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when sending a message to browser window', () => {
    beforeEach(() => {
      spyOn(injectedWindow, 'postMessage');

      service.send(MOCK_WINDOW_MESSAGE, MOCK_WINDOW as Window);
    });

    it('should send message to current browser window context', () => {
      expect(injectedWindow.postMessage).toBeCalledTimes(1);
      expect(injectedWindow.postMessage).toHaveBeenCalledWith(MOCK_WINDOW_MESSAGE_WRAPPER, MOCK_ALL_ORIGINS);
    });
  });

  describe('when listening to browser window messages', () => {
    const MOCK_SUBJECT: rxjs.ReplaySubject<MessageEvent> = new rxjs.ReplaySubject<MessageEvent>(1);

    beforeEach(() => {
      spyOn(rxjs, 'fromEvent').and.returnValue(MOCK_SUBJECT.asObservable());
    });

    describe('and when new message is sent from outside Wallapop', () => {
      const MESSAGE_FROM_OUTSIDE: MessageEvent = new MessageEvent('message', { data: { dontdead: 'openinside' } });

      it('should ignore it', fakeAsync(() => {
        let result: WindowMessage;

        service.listen(MOCK_WINDOW as Window).subscribe((data) => (result = data));
        MOCK_SUBJECT.next(MESSAGE_FROM_OUTSIDE);
        tick();

        expect(result).toBeFalsy();
      }));
    });

    describe('and when new message is sent within Wallapop', () => {
      const MESSAGE_FROM_WALLAPOP = new MessageEvent('message', { data: MOCK_WINDOW_MESSAGE_WRAPPER });

      it('should capture it', fakeAsync(() => {
        let result: WindowMessage;

        service.listen(MOCK_WINDOW as Window).subscribe((data) => (result = data));
        MOCK_SUBJECT.next(MESSAGE_FROM_WALLAPOP);
        tick();

        expect(result).toEqual(MOCK_WINDOW_MESSAGE);
      }));
    });
  });
});
