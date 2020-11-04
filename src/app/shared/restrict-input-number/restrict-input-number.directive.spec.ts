import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RestrictInputNumberDirective } from './restrict-input-number.directive';

@Component({
  template: `<form>
    <input
      type="text"
      [(ngModel)]="value"
      name="field"
      tslRestrictInputNumber
    />
  </form>`,
})
class TestComponent {
  value: string;
}

describe('RestrictInputNumberDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictInputNumberDirective, TestComponent],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(
      By.directive(RestrictInputNumberDirective)
    )[0].nativeElement;
    fixture.detectChanges();
  }));

  it('should prevent default if one of the prohibited keys is pressed', () => {
    const prohibitedValues = [200, 300, 10];
    prohibitedValues.forEach((key) => {
      const event = keyPress(element, key);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  it('should NOT prevent default if another key is pressend', () => {
    const event = keyPress(element, 48);

    expect(event.defaultPrevented).toBe(false);
  });

  function keyPress(elem: HTMLElement, k: any) {
    let event: any = document.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'keyCode', {
      get: function () {
        return this.keyCodeVal;
      },
      set: function (k) {
        this.keyCodeVal = k;
      },
    });
    event.initEvent('keydown', true, true);
    event.keyCode = k;
    elem.dispatchEvent(event);
    return event;
  }
});
