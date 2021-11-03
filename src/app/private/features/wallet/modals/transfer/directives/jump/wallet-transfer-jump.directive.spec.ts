import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransferJumpDirective } from './wallet-transfer-jump.directive';

@Component({
  template: `<input
      type="text"
      tslWalletTransferJump
      [jumpKey]="jumpKey"
      [jumpOnlyEmpty]="jumpOnlyEmpty"
      [jumpTargetId]="jumpTargetId"
      #firstId
    /><input type="text" #secondId />`,
})
class TestComponent {
  public jumpKey: string[] | string;
  public jumpOnlyEmpty: boolean;
  public jumpTargetId: string;

  constructor() {}
}

describe('WalletTransferMaxLengthDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let htmlInputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransferJumpDirective, TestComponent],
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
    htmlInputElement = fixture.debugElement.query(By.directive(WalletTransferJumpDirective)).nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN any input parameter is not valid', () => {
    let getElementByIdSpy;

    beforeEach(() => {
      getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue({});
    });

    describe('WHEN the jump key is empty', () => {
      it('should not jump', () => {
        component.jumpKey = '';

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the jump key is null', () => {
      it('should not jump', () => {
        component.jumpKey = null;

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the jump key is an empty array', () => {
      it('should not jump', () => {
        component.jumpKey = [];

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the target is null', () => {
      it('should not jump ', () => {
        component.jumpKey = 'Period';
        component.jumpTargetId = null;

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the target is empty', () => {
      it('should not jump ', () => {
        component.jumpKey = 'Period';
        component.jumpTargetId = '';

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('WHEN all input parameter are valid', () => {
    let getElementByIdSpy;

    beforeEach(() => {
      component.jumpKey = 'Period';
      component.jumpTargetId = 'secondId';
    });

    describe('WHEN the key is a string', () => {
      it('should get the target', () => {
        getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(null);

        fixture.detectChanges();
        keyPress('.');

        expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the key is an array', () => {
      it('should get the target', () => {
        component.jumpKey = ['Period', 'Comma'];
        getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(null);

        fixture.detectChanges();
        keyPress(',');

        expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the target is not valid', () => {
      it('should not jump', () => {
        const target = null;
        getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);

        fixture.detectChanges();

        expect(keyPress('.').defaultPrevented).toBe(false);
      });
    });

    describe('WHEN the target is valid', () => {
      const target = {
        focus() {},
        select() {},
      };
      describe('AND WHEN jumping can be done with characters', () => {
        describe('AND WHEN the input is not empty', () => {
          it('should jump to the targe', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const focusSpy = spyOn(target, 'focus').and.callThrough();
            component.jumpOnlyEmpty = false;
            htmlInputElement.value = 'No empty';

            fixture.detectChanges();
            keyPress('.');

            expect(focusSpy).toHaveBeenCalledTimes(1);
          });

          it('should select the target content', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const selectSpy = spyOn(target, 'select').and.callThrough();
            component.jumpOnlyEmpty = false;
            htmlInputElement.value = 'No empty';

            fixture.detectChanges();
            keyPress('.');

            expect(selectSpy).toHaveBeenCalledTimes(1);
          });
        });

        describe('AND WHEN the input is empty', () => {
          it('should jump to the target', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const focusSpy = spyOn(target, 'focus').and.callThrough();
            component.jumpOnlyEmpty = false;
            htmlInputElement.value = '';

            fixture.detectChanges();
            keyPress('.');

            expect(focusSpy).toHaveBeenCalledTimes(1);
          });

          it('should select the target content', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const selectSpy = spyOn(target, 'select').and.callThrough();
            component.jumpOnlyEmpty = false;
            htmlInputElement.value = '';

            fixture.detectChanges();
            keyPress('.');

            expect(selectSpy).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('AND WHEN jumping can be done without characters', () => {
        describe('AND WHEN the input is not empty', () => {
          it('should not jump to the target', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const focusSpy = spyOn(target, 'focus').and.callThrough();
            component.jumpOnlyEmpty = true;
            htmlInputElement.value = 'No empty';

            fixture.detectChanges();
            keyPress('.');

            expect(focusSpy).not.toHaveBeenCalled();
          });

          it('should not select the target content', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const selectSpy = spyOn(target, 'select').and.callThrough();
            component.jumpOnlyEmpty = true;
            htmlInputElement.value = 'No empty';

            fixture.detectChanges();
            keyPress('.');

            expect(selectSpy).toHaveBeenCalledTimes(0);
          });
        });

        describe('AND WHEN the input is empty', () => {
          it('should jump to the target', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const focusSpy = spyOn(target, 'focus').and.callThrough();
            component.jumpOnlyEmpty = true;
            htmlInputElement.value = '';

            fixture.detectChanges();
            keyPress('.');

            expect(focusSpy).toHaveBeenCalledTimes(1);
          });

          it('should select the target content', () => {
            getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(target);
            const selectSpy = spyOn(target, 'select').and.callThrough();
            component.jumpOnlyEmpty = true;
            htmlInputElement.value = '';

            fixture.detectChanges();
            keyPress('.');

            expect(selectSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  function getKeys(): Record<string, string> {
    const result: Record<string, string> = {
      '.': 'Period',
      ',': 'Comma',
    };
    return result;
  }

  function keyPress(key: string): KeyboardEvent {
    const keys = getKeys();
    const keyDownEvent = new KeyboardEvent('keydown', { code: keys[key], key: key });
    htmlInputElement.dispatchEvent(keyDownEvent);
    return keyDownEvent;
  }
});
