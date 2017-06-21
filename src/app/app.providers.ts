import { HttpService, WindowRef } from 'shield';
import { XHRBackend, RequestOptions } from '@angular/http';
import { Provider, ErrorHandler } from '@angular/core';

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
  return new HttpService(backend, defaultOptions);
}

export function providers(): Provider[] {
  return [
    {
      provide:    HttpService,
      useFactory: httpFactory,
      deps:       [XHRBackend, RequestOptions]
    },
    WindowRef
  ];
}
