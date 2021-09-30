import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  template: `<input tslNumbersOnly />`,
})
class TestComponent {}

describe('NumbersOnlyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input: HTMLElement;

  const alphabeticalKeys = [['a'], ['B'], ['c'], ['D'], ['f'], ['G'], ['x'], ['Y'], ['z']];
  const allowedNumbers = [['0'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9']];
  const allowedSpecialKeys = [['ArrowDown'], ['ArrowLeft'], ['ArrowRight'], ['ArrowUp'], ['Backspace'], ['Delete'], ['Tab']];
  const disallowedKeys = [[' '], ['e'], ['E']];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NumbersOnlyDirective, TestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.directive(NumbersOnlyDirective)).nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('when the key down have been pulsed...', () => {
    describe.each(allowedNumbers)('WHEN the character is a number', (key) => {
      it('should let us to use it', () => {
        expect(keyPress(key).defaultPrevented).toBe(false);
      });
    });

    describe.each(allowedSpecialKeys)('WHEN the character is an allowed key', (key) => {
      it('should let us to use it', () => {
        expect(keyPress(key).defaultPrevented).toBe(false);
      });
    });

    describe.each(disallowedKeys)('WHEN the character is a disallowed key', (key) => {
      it('should let us to use it', () => {
        expect(keyPress(key).defaultPrevented).toBe(true);
      });
    });

    describe.each(alphabeticalKeys)('WHEN the character is not a number', (key) => {
      it('should revert the character', () => {
        expect(keyPress(key).defaultPrevented).toBe(true);
      });
    });
  });

  function keyPress(k: string): KeyboardEvent {
    const event: any = document.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'key', {
      get: function (): string {
        return this.keyVal;
      },
      set: function (k: string): void {
        this.keyVal = k;
      },
    });

    event.initEvent('keydown', true, true);
    event.key = k;
    input.dispatchEvent(event);
    return event;
  }
});
