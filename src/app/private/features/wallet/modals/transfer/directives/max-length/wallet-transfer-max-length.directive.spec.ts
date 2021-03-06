import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransferMaxLengthDirective } from '@private/features/wallet/modals/transfer/directives/max-length/wallet-transfer-max-length.directive';

@Component({
  template: `<input type="input" [tslWalletTransferMaxLength]="maxLength" />`,
})
class TestComponent {
  public maxLength: number;
  constructor() {}
}

describe('WalletTransferMaxLengthDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let htmlInputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransferMaxLengthDirective, TestComponent],
      providers: [
        {
          provide: Document,
          useValue: document,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    document = TestBed.inject(Document);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    htmlInputElement = fixture.debugElement.query(By.directive(WalletTransferMaxLengthDirective)).nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN the input element has less than maximum allowed characters', () => {
    describe.each([[''], ['1'], ['12'], ['123'], ['1234']])('AND WHEN input value is not null', (value) => {
      it('should allow the new character pressed', () => {
        component.maxLength = 5;
        htmlInputElement.value = value;

        fixture.detectChanges();

        expect(keyPress('1').defaultPrevented).toBe(false);
      });
    });
  });

  describe('WHEN the input element has not specify the maximum length of characters', () => {
    describe.each([[''], ['1'], ['12'], ['123'], ['1234'], ['12345678901'], ['ABCDEFGHIJKLMNOPQRSTUVWXY']])(
      'AND WHEN the value is not null',
      (value) => {
        it('should allow the new character pressed', () => {
          component.maxLength = null;
          htmlInputElement.value = value;

          fixture.detectChanges();

          expect(keyPress('1').defaultPrevented).toBe(false);
        });
      }
    );
  });

  describe('WHEN the input element has the maximum length of characters', () => {
    describe('AND WHEN there is no selection', () => {
      it('should not allow the new character pressed', () => {
        component.maxLength = 2;
        htmlInputElement.value = '12';
        const selection = {
          toString() {
            return '';
          },
        };
        document.getSelection = () => {
          return null;
        };
        spyOn(document, 'getSelection').and.returnValue(selection);

        fixture.detectChanges();

        expect(keyPress('1').defaultPrevented).toBe(true);
      });
      it('should allow the new character pressed when it is an allowed character', () => {
        component.maxLength = 3;
        htmlInputElement.value = '123';
        document.getSelection = () => {
          return null;
        };
        spyOn(document, 'getSelection').and.returnValue(null);

        fixture.detectChanges();

        expect(keyPress('Backspace').defaultPrevented).toBe(false);
      });
    });
    describe('AND WHEN there is selection', () => {
      it('should allow the new character pressed', () => {
        component.maxLength = 4;
        htmlInputElement.value = '1234';
        const selection = {
          toString() {
            return '2';
          },
        };
        document.getSelection = () => {
          return selection as Selection;
        };
        spyOn(document, 'getSelection').and.returnValue(selection);

        fixture.detectChanges();

        expect(keyPress('1').defaultPrevented).toBe(false);
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
    htmlInputElement.dispatchEvent(event);
    return event;
  }
});
