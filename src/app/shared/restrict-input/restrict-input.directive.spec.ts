import { RestrictInputDirective } from './restrict-input.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  template: ` <form>
    <input type="text" [(ngModel)]="value" name="field" tslRestrictInput />
  </form>`,
})
class TestComponent {
  value: string;
}

describe('RestrictInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictInputDirective, TestComponent],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(
      By.directive(RestrictInputDirective)
    )[0];
    fixture.detectChanges();
  }));

  it('should add a valid new input', () => {
    const TEXT = 'hola';
    const VALID = 'a';

    element.nativeElement.value = TEXT + VALID;
    element.triggerEventHandler('input', {
      target: element.nativeElement,
      data: VALID,
    });

    expect(fixture.componentInstance.value).toBe(TEXT + VALID);
  });

  it('should remove an invalid input', () => {
    const TEXT = 'hola';
    const INVALID = '😄';

    element.nativeElement.value = TEXT + INVALID;
    element.triggerEventHandler('input', {
      target: element.nativeElement,
      data: INVALID,
    });

    expect(fixture.componentInstance.value).toBe(TEXT);
  });
});
