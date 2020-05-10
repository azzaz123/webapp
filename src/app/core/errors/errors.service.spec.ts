import { TestBed } from '@angular/core/testing';
import { ErrorsService, DEFAULT_ERROR_MESSAGE } from './errors.service';
import { ToastService } from '../toast/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';

class MockedToast {
  error(message: string, title?: string): any {
  }

  success() {
  }
}

@Component({
  template: '<router-outlet></router-outlet>'
})
class RoutingComponent {
}

@Component({
  template: ''
})
class LoginComponent {
}

let toastService: ToastService;
let service: ErrorsService;
let i18n: I18nService;

const ERROR_MESSAGE = 'Usuario o contraseña incorrectos';

describe('Service: Errors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', component: LoginComponent}
        ])
      ],
      declarations: [
        LoginComponent,
        RoutingComponent
      ],
      providers: [
        ErrorsService,
        {provide: ToastService, useClass: MockedToast},
        {
          provide: I18nService, useValue: {
          getTranslations() {
          }
        }
        }
      ]
    });
    TestBed.createComponent(RoutingComponent);
    toastService = TestBed.get(ToastService);
    service = TestBed.get(ErrorsService);
    i18n = TestBed.get(I18nService);
    spyOn(toastService, 'error').and.callThrough();
    spyOn(toastService, 'success').and.callThrough();
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should call the toastService.error method if there are errors in array', () => {
      const res = new HttpErrorResponse({ error: [{message: ERROR_MESSAGE }]});

      service.show(res);

      expect(toastService.error).toHaveBeenCalledWith(ERROR_MESSAGE, 'Oops!');
    });

    it('should call the toastService.error method if there are errors', () => {
      const res = new HttpErrorResponse({ error: { message: ERROR_MESSAGE }});

      service.show(res);

      expect(toastService.error).toHaveBeenCalledWith(ERROR_MESSAGE, 'Oops!');
    });

    it('should call the toastService.error with default message method if no error message', () => {
      const res = new HttpErrorResponse({ error: {} });

      service.show(res);

      expect(toastService.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE, 'Oops!');
    });
  });

  describe('i18nError', () => {
    it('should call toastService.error with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key');

      expect(toastService.error).toHaveBeenCalledWith('message', 'title');
    });
    it('should call toastService.error with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key', 'text');

      expect(toastService.error).toHaveBeenCalledWith('messagetext', 'title');
    });
  });

  describe('i18nSuccess', () => {
    it('should call toastService.success with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key');

      expect(toastService.success).toHaveBeenCalledWith('message', 'title');
    });
    it('should call toastService.success with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key', 'text');

      expect(toastService.success).toHaveBeenCalledWith('messagetext', 'title');
    });
  });
});
