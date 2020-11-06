import {
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SwitchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('input element', () => {
    it('should not be checked when component checked property is false', fakeAsync(() => {
      component.checked = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector(
        'input[type=checkbox]'
      ) as HTMLInputElement;
      expect(element.checked).toBeFalsy();
    }));

    it('should be checked when component checked property is true', fakeAsync(() => {
      component.checked = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector(
        'input[type=checkbox]'
      ) as HTMLInputElement;
      expect(element.checked).toBeTruthy();
    }));

    it('should be enable when component disabled property is false', fakeAsync(() => {
      component.disabled = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector(
        'input[type=checkbox]'
      ) as HTMLInputElement;
      expect(element.disabled).toBeFalsy();
    }));

    it('should be disable when component disabled property is true', fakeAsync(() => {
      component.disabled = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector(
        'input[type=checkbox]'
      ) as HTMLInputElement;
      expect(element.disabled).toBeTruthy();
    }));
  });

  it('should emit change action and set model, when switch is changed', () => {
    let inputValue: boolean;
    component.onChange.subscribe((value) => (inputValue = value));

    const element = el.querySelector(
      'input[type=checkbox]'
    ) as HTMLInputElement;
    element.click();

    expect(inputValue).toBeTruthy();
    expect(component.model).toBe(true);
  });
});
