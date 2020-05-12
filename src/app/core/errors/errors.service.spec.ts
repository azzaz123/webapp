import { TestBed } from '@angular/core/testing';
import { ErrorsService, DEFAULT_ERROR_MESSAGE } from './errors.service';
import { ToastService } from '../../layout/toast/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';



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
    spyOn(toastService, 'show').and.callThrough();
    //spyOn(toastService, 'error').and.callThrough();
    //spyOn(toastService, 'success').and.callThrough();
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should call the toastService.show method for type error if there are errors in array', () => {
      const res = new HttpErrorResponse({ error: [{message: ERROR_MESSAGE }]});

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({text:ERROR_MESSAGE, title:'Oops!',type:'error'});
    });

    it('should call the toastService.show method for type error if there are errors', () => {
      const res = new HttpErrorResponse({ error: { message: ERROR_MESSAGE }});

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({text:ERROR_MESSAGE, title:'Oops!',type:'error'});
    });

    it('should call the toastService.show method for type error with default message method if no error message', () => {
      const res = new HttpErrorResponse({ error: {} });

      service.show(res);

      expect(toastService.show).toHaveBeenCalledWith({text:DEFAULT_ERROR_MESSAGE, title:'Oops!', type:"error"});
    });
  });

  describe('i18nError', () => {
    it('should call toastService.show method for type error with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key');

      expect(toastService.show).toHaveBeenCalledWith({text:'message', title:'title', type:"error"});
    });
    it('should call toastService.show method for type error with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nError('key', 'text');
     
    
    
      expect(toastService.show).toHaveBeenCalledWith({text:'messagetext', title:'title', type:"error"});
    });
  });

  describe('i18nSuccess', () => {
    it('should call toastService.show method for type success with i18n message', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key');

      expect(toastService.show).toHaveBeenCalledWith({text:'message', title:'title', type:"success"});
    });
    it('should call toastService.show method for type success with i18n message, concatenting text', () => {
      spyOn(i18n, 'getTranslations').and.returnValues('message', 'title');

      service.i18nSuccess('key', 'text');

      expect(toastService.show).toHaveBeenCalledWith({text:'messagetext', title:'title',type:"success"});
    });
  });
});
