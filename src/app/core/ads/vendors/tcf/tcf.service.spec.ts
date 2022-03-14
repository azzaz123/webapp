import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { TcfService } from './tcf.service';

describe('TcfService', () => {
  let service: TcfService;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      __tcfapi: () => {},
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });
    service = TestBed.inject(TcfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
