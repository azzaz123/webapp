import { TestBed } from '@angular/core/testing';
import { ErrorsService } from './errors.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  template: '<router-outlet></router-outlet>',
})
class RoutingComponent {}

@Component({
  template: '',
})
class LoginComponent {}

let toastService: ToastService;
let service: ErrorsService;
let i18n: I18nService;

const ERROR_MESSAGE = 'Usuario o contraseña incorrectos';

describe('Service: Errors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'login', component: LoginComponent }])],
      declarations: [LoginComponent, RoutingComponent],
      providers: [ErrorsService, ToastService, I18nService],
    });
    TestBed.createComponent(RoutingComponent);
    toastService = TestBed.inject(ToastService);
    service = TestBed.inject(ErrorsService);
    i18n = TestBed.inject(I18nService);
    spyOn(toastService, 'show').and.callThrough();
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should call the toastService.show method for type error if there are errors in array', () => {
      const res = new HttpErrorResponse({
        error: [{ message: ERROR_MESSAGE }],
      });

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({
        text: ERROR_MESSAGE,
        title: 'Oops!',
        type: 'error',
      });
    });

    it('should call the toastService.show method for type error if there are errors', () => {
      const res = new HttpErrorResponse({ error: { message: ERROR_MESSAGE } });

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({
        text: ERROR_MESSAGE,
        title: 'Oops!',
        type: 'error',
      });
    });

    it('should call the toastService.show method for type error with default message method if no error message', () => {
      const res = new HttpErrorResponse({ error: {} });

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({
        text: i18n.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE),
        title: 'Oops!',
        type: 'error',
      });
    });
  });

  describe('i18nError', () => {
    it('should call toastService.show method for type error with i18n message', () => {
      spyOn(i18n, 'translate').and.returnValues('message', 'title');

      service.i18nError('key' as TRANSLATION_KEY);

      expect(toastService.show).toHaveBeenCalledWith({
        text: 'message',
        title: 'title',
        type: 'error',
      });
    });

    it('should call toastService.show method for type error with i18n message, concatenating text', () => {
      spyOn(i18n, 'translate').and.returnValues('message', 'title');

      service.i18nError('key' as TRANSLATION_KEY, 'text');

      expect(toastService.show).toHaveBeenCalledWith({
        text: 'message text',
        title: 'title',
        type: 'error',
      });
    });
  });

  describe('i18nSuccess', () => {
    it('should call toastService.show method for type success with i18n message', () => {
      spyOn(i18n, 'translate').and.returnValues('message', 'title');

      service.i18nSuccess('key' as TRANSLATION_KEY);

      expect(toastService.show).toHaveBeenCalledWith({
        text: 'message',
        title: 'title',
        type: 'success',
      });
    });
    it('should call toastService.show method for type success with i18n message, concatenating text', () => {
      spyOn(i18n, 'translate').and.returnValues('message', 'title');

      service.i18nSuccess('key' as TRANSLATION_KEY, 'text');

      expect(toastService.show).toHaveBeenCalledWith({
        text: 'message text',
        title: 'title',
        type: 'success',
      });
    });
  });
});
