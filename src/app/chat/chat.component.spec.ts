/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';

describe('Component: Chat', () => {

  let component: ChatComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        ChatComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    component = TestBed.createComponent(ChatComponent).componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
