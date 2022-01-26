import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebounceKeyupDirective } from './debounce-keyup.directive';

@Component({
  template: `<input type="text" [debouncedKeyupTime]="debounceTime" debounce-keyup (debouncedKeyup)="fnToBeCalled()" />`,
})
class TestComponent {
  debounceTime: number = 200;

  fnToBeCalled(): void {}
}

describe('DebounceKeyupDirective', () => {
  let component: TestComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebounceKeyupDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should emit the event only once', (done) => {
    const inputSelector = 'input';
    const inputElement = de.query(By.css(inputSelector));
    const keysPressedCount = 5;
    spyOn(component, 'fnToBeCalled');

    for (let index = 0; index < keysPressedCount; index++) {
      inputElement.triggerEventHandler('keyup', {});
    }

    setTimeout(() => {
      expect(component.fnToBeCalled).toHaveBeenCalledTimes(1);
      done();
    }, component.debounceTime * keysPressedCount);
  });
});
