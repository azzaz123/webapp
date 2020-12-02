import {
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [CheckboxComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('checkbox', () => {
    it('should not be checked when component checked property is false', fakeAsync(() => {
      component.checked = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('button') as HTMLInputElement;
      expect(element.className).not.toContain('selected');
    }));

    it('should be checked when component checked property is true', fakeAsync(() => {
      component.checked = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('button') as HTMLInputElement;
      expect(element.className).toContain('selected');
    }));
  });

  it('should emit checkedChange action, when checkbox is changed', () => {
    let inputValue: boolean;
    component.checkedChange.subscribe((value) => (inputValue = value));

    const element = el.querySelector('button') as HTMLInputElement;
    element.click();

    expect(inputValue).toBe(true);
  });

  it('should emit onChange action, when checkbox is changed', () => {
    let inputValue: boolean;
    component.onChange.subscribe((value) => (inputValue = value));

    const element = el.querySelector('button') as HTMLInputElement;
    element.click();

    expect(inputValue).toBe(true);
  });
});
