import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';

import { CounterSpecificationComponent } from './counter-specification.component';

describe('CounterSpecificationComponent', () => {
  const svgTag = 'tsl-svg-icon';
  const labelClass = '.CounterSpec__measure';
  const containerCounterClass = '.CounterSpec__counter';
  const random = 'Random';
  let component: CounterSpecificationComponent;
  let fixture: ComponentFixture<CounterSpecificationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterSpecificationComponent],
      imports: [SvgIconModule, HttpClientTestingModule],
    })
      .overrideComponent(CounterSpecificationComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSpecificationComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we handle specific type', () => {
    describe('and it has a defined counter and label', () => {
      beforeEach(() => {
        component.type = REAL_STATE_TYPE.BOX_ROOM;
        fixture.detectChanges();
      });

      it('should show the svg type and the label type', () => {
        const icon: HTMLElement = el.querySelector(svgTag);
        const numberCounter = de.query(By.css(containerCounterClass));
        const label = fixture.debugElement.query(By.css(labelClass)).nativeElement;

        expect(icon).toBeTruthy();
        expect(`${icon.getAttribute('ng-reflect-src')}svg`).toEqual(component.specificationCounter.icon);
        expect(numberCounter).toBeFalsy();
        expect(label.innerHTML).toEqual(component.translation);
      });
    });

    describe('and it ONLY has a defined svg', () => {
      beforeEach(() => {
        component.type = CAR_SPECIFICATION_TYPE.TWO_DOORS;
        fixture.detectChanges();
      });

      it('ONLY should show the svg type', () => {
        const icon: HTMLElement = el.querySelector(svgTag);
        const label = fixture.debugElement.query(By.css(labelClass)).nativeElement;
        const numberCounter = de.query(By.css(containerCounterClass));

        expect(icon).toBeTruthy();
        expect(`${icon.getAttribute('ng-reflect-src')}svg`).toEqual(component.specificationCounter.icon);
        expect(numberCounter).toBeFalsy();
        expect(label.innerHTML).toEqual('');
      });
    });

    describe('and it ONLY has a definded label ', () => {
      beforeEach(() => {
        component.type = REAL_STATE_TYPE.BATHROOMS;
        fixture.detectChanges();
      });

      it('should show the label and NOT the icon', () => {
        const icon: HTMLElement = el.querySelector(svgTag);
        const label = de.query(By.css(labelClass)).nativeElement;

        expect(icon).toBeFalsy();
        expect(label.innerHTML).toEqual(component.translation);
      });
    });
  });

  describe('when we handle a custom values', () => {
    describe('and we pass the counter and the label', () => {
      beforeEach(() => {
        component.label = random;
        fixture.detectChanges();
      });

      it('should show the custom label', () => {
        const label = fixture.debugElement.query(By.css(labelClass)).nativeElement;

        expect(label.innerHTML).toEqual(random);
      });

      describe('and the counter is a number', () => {
        it('should show the numeric counter', () => {
          component.counter = 4;
          fixture.detectChanges();

          const icon: HTMLElement = el.querySelector(svgTag);
          const numberCounter = de.query(By.css(containerCounterClass)).nativeElement;

          expect(icon).toBeFalsy();
          expect(numberCounter.innerHTML).toBe('4');
        });
      });

      describe('and the counter is a svg', () => {
        it('should show the icon counter', () => {
          component.counter = 'svgpath';
          fixture.detectChanges();

          const icon: HTMLElement = el.querySelector(svgTag);
          const numberCounter = de.query(By.css(containerCounterClass));

          expect(icon).toBeTruthy();
          expect(numberCounter).toBeFalsy();
        });
      });
    });
  });

  describe('when we DO NOT have values', () => {
    it('should NOT show the icon and the number counter', () => {
      component.counter = null;
      fixture.detectChanges();

      const icon: HTMLElement = el.querySelector(svgTag);
      const numberCounter = de.query(By.css(containerCounterClass)).nativeElement;

      expect(icon).toBeFalsy();
      expect(numberCounter.innerHTML).toBe('');
    });
  });
});
