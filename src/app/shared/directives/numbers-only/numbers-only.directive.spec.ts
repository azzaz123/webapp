import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  template: `<input tslNumbersOnly />`,
})
class TestComponent {}

describe('NumbersOnlyDirective', () => {
  const NUMERIC_VALUE = '1234';
  const VARCHAR_VALUE = 'ABCD';
  const ALPHANUMERIC_VALUE = '1A2B3C4D';

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input: DebugElement;

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
    input = fixture.debugElement.query(By.css('input'));
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('when the input value changes...', () => {
    describe('and the new character is a number...', () => {
      it('should keep it on the value', fakeAsync(() => {
        input.nativeElement.value = VARCHAR_VALUE;

        input.nativeElement.dispatchEvent(new Event('input'));
        tick();

        expect(input.nativeElement.value).toBe('');
      }));
    });

    describe('and the new character is NOT a number...', () => {
      it('should delete it on the value', fakeAsync(() => {
        input.nativeElement.value = NUMERIC_VALUE;

        input.nativeElement.dispatchEvent(new Event('input'));
        tick();

        expect(input.nativeElement.value).toBe(NUMERIC_VALUE);
      }));
    });

    describe('and the input is filled by letters and numbers...', () => {
      it('should only keep the numbers', fakeAsync(() => {
        input.nativeElement.value = ALPHANUMERIC_VALUE;

        input.nativeElement.dispatchEvent(new Event('input'));
        tick();

        expect(input.nativeElement.value).toBe(NUMERIC_VALUE);
      }));
    });
  });
});
