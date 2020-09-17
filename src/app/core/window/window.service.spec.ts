/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { WindowRef } from './window.service';

let service: WindowRef;

describe('Service: WindowRef', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRef]
    });
    service = TestBed.inject(WindowRef);
  });

  it('should return window', () => {
    expect(service.nativeWindow).toEqual(window);
  });


});
