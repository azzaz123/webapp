/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StarsRateComponent } from './stars-rate.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Component: Stars Rate', () => {
  let component: StarsRateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarsRateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    component = TestBed.createComponent(StarsRateComponent).componentInstance;
  });

  describe('ngOnInit', () => {
    it('should create initial array', () => {
      component.ngOnInit();
      expect(component.starsArray.length).toBe(5);
    });
  });

  describe('onHover', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set as full the first star', () => {
      component.onHover(1);
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('empty');
      expect(component.starsArray[2].type).toBe('empty');
      expect(component.starsArray[3].type).toBe('empty');
      expect(component.starsArray[4].type).toBe('empty');
    });
    it('should set as full the first 3 stars', () => {
      component.onHover(3);
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('full');
      expect(component.starsArray[2].type).toBe('full');
      expect(component.starsArray[3].type).toBe('empty');
      expect(component.starsArray[4].type).toBe('empty');
    });
    it('should set as full all the stars', () => {
      component.onHover(5);
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('full');
      expect(component.starsArray[2].type).toBe('full');
      expect(component.starsArray[3].type).toBe('full');
      expect(component.starsArray[4].type).toBe('full');
    });
  });

  describe('resetHovered', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should reset all stars to empty', () => {
      component.resetHovered();
      expect(component.starsArray[0].type).toBe('empty');
      expect(component.starsArray[1].type).toBe('empty');
      expect(component.starsArray[2].type).toBe('empty');
      expect(component.starsArray[3].type).toBe('empty');
      expect(component.starsArray[4].type).toBe('empty');
    });
    it('should reset all stars to empty except the first', () => {
      component['score'] = 1;
      component.resetHovered();
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('empty');
      expect(component.starsArray[2].type).toBe('empty');
      expect(component.starsArray[3].type).toBe('empty');
      expect(component.starsArray[4].type).toBe('empty');
    });
    it('should reset all stars to empty except the first 3', () => {
      component['score'] = 3;
      component.resetHovered();
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('full');
      expect(component.starsArray[2].type).toBe('full');
      expect(component.starsArray[3].type).toBe('empty');
      expect(component.starsArray[4].type).toBe('empty');
    });
    it('should set as full all the stars', () => {
      component['score'] = 5;
      component.resetHovered();
      expect(component.starsArray[0].type).toBe('full');
      expect(component.starsArray[1].type).toBe('full');
      expect(component.starsArray[2].type).toBe('full');
      expect(component.starsArray[3].type).toBe('full');
      expect(component.starsArray[4].type).toBe('full');
    });
  });

  describe('setScore', () => {
    it('should set score', () => {
      component.setScore(2);
      expect(component['score']).toBe(2);
    });
    it('should emit change event', fakeAsync(() => {
      let score: number;
      component.handleOnChange.subscribe((s: number) => {
        score = s;
      });
      component.setScore(3);
      tick();
      expect(score).toBe(3);
    }));
  });
});
