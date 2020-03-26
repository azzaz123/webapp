import { TestBed } from '@angular/core/testing';
import { ErrorsService, DEFAULT_ERROR_MESSAGE } from './errors.service';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';

class MockedToastr {
  error(message: string, title?: string, optionsOverride?: any): any {
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

let toasts: ToastrService;
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
        {provide: ToastrService, useClass: MockedToastr},
        {
          provide: I18nService, useValue: {
          getTranslations() {
          }
        }
        }
      ]
    });
    TestBed.createComponent(RoutingComponent);
    toasts = TestBed.get(ToastrService);
    service = TestBed.get(ErrorsService);
    i18n = TestBed.get(I18nService);
    spyOn(toasts, 'error').and.callThrough();
    spyOn(toasts, 'success').and.callThrough();
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should call the toastr.error method if there are errors in array', () => {
      const res = new HttpErrorResponse({ error: [{message: ERROR_MESSAGE }]});

      service.show(res);

      expect(toasts.error).toHaveBeenCalledWith(ERROR_MESSAGE, 'Oops!');
    });

    it('should call the toastr.error method if there are errors', () => {
      const res = new HttpErrorResponse({ error: { message: ERROR_MESSAGE }});

      service.show(res);

      expect(toasts.error).toHaveBeenCalledWith(ERROR_MESSAGE, 'Oops!');
    });

    it('should call the toastr.error with default message method if no error message', () => {
      const res = new HttpErrorResponse({ error: {} });

      service.show(res);

      expect(toasts.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE, 'Oops!');
    });
  });

  describe('i18nError', () => {
    it('should call toastr.error with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key');

      expect(toasts.error).toHaveBeenCalledWith('message', 'title');
    });
    it('should call toastr.error with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key', 'text');

      expect(toasts.error).toHaveBeenCalledWith('messagetext', 'title');
    });
  });

  describe('i18nSuccess', () => {
    it('should call toastr.success with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key');

      expect(toasts.success).toHaveBeenCalledWith('message', 'title');
    });
    it('should call toastr.success with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key', 'text');

      expect(toasts.success).toHaveBeenCalledWith('messagetext', 'title');
    });
  });
});
