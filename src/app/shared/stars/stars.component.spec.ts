/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { TestBed } from '@angular/core/testing';
import { StarsComponent } from './stars.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Component: Stars', () => {
  let component: StarsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    component = TestBed.createComponent(StarsComponent).componentInstance;
  });

  it('should create the stars array', () => {
    component.stars = 3;
    component.ngOnChanges();
    expect(component.starsArray.length).toBe(5);
    expect(component.starsArray[0].active).toBeTruthy();
    expect(component.starsArray[1].active).toBeTruthy();
    expect(component.starsArray[2].active).toBeTruthy();
    expect(component.starsArray[3].active).toBeFalsy();
    expect(component.starsArray[4].active).toBeFalsy();
  });
});
