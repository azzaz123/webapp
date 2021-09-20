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
    describe('and the new character is a number...', () => {
      it('should keep it on the value', () => {
        expect(keyPress('4').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the delete one ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('Backspace').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the tab one ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('Tab').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the down arrow ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('ArrowDown').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the left arrow ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('ArrowLeft').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the right arrow ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('ArrowRight').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the up arrow ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('ArrowUp').defaultPrevented).toBe(false);
      });
    });

    describe('and the new key is the delete key ...', () => {
      it('should let us to use it', () => {
        expect(keyPress('Delete').defaultPrevented).toBe(false);
      });
    });

    describe('and the new character is an space...', () => {
      it('should revert the character', () => {
        expect(keyPress(' ').defaultPrevented).toBe(true);
      });
    });

    describe('and the new character is NOT a number...', () => {
      it('should revert the character', () => {
        expect(keyPress('a').defaultPrevented).toBe(true);
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
