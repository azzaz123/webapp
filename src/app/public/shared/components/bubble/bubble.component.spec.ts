import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Predicate } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.enum';

describe('BubbleComponent', () => {
  let component: BubbleComponent;
  let fixture: ComponentFixture<BubbleComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BubbleComponent, SvgIconComponent],
      imports: [CommonModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When icon input is...', () => {
    const iconSelector = By.css('.Bubble__icon');

    describe('not provided', () => {
      beforeEach(async () => {
        await setInputs({ icon: undefined });
      });
      it('should not render', () => {
        expectRender(iconSelector, false);
      });
    });

    describe('provided with counter', () => {
      beforeEach(async () => {
        await setInputs({ icon: '/icon.svg', counter: 1 });
      });
      it('should not render', () => {
        expectRender(iconSelector, false);
      });
    });

    describe('provided without counter', () => {
      beforeEach(async () => {
        await setInputs({ icon: '/icon.svg', counter: undefined });
      });
      it('should render', () => {
        expectRender(iconSelector, true);
      });
    });
  });

  describe('When counter input is...', () => {
    const counterSelector = By.css('.Bubble__counter');

    describe('not provided', () => {
      beforeEach(async () => {
        await setInputs({ counter: undefined });
      });
      it('should not render', () => {
        expectRender(counterSelector, false);
      });
    });

    describe('provided with icon', () => {
      beforeEach(async () => {
        await setInputs({ counter: 1, icon: '/icon.svg' });
      });
      it('should render', () => {
        expectRender(counterSelector, true);
      });
    });

    describe('provided without icon', () => {
      beforeEach(async () => {
        await setInputs({ counter: 1, icon: undefined });
      });
      it('should render', () => {
        expectRender(counterSelector, true);
      });

      describe('and counter is <= 9', () => {
        it('should render value', () => {
          expectTextContent(counterSelector, '1');
        });
      });

      describe('and counter is > 9', () => {
        beforeEach(async () => {
          await setInputs({ counter: 13, icon: undefined });
        });
        it('should render +9', () => {
          expectTextContent(counterSelector, '+9');
        });
      });
    });
  });

  describe('When dropdown is...', () => {
    const dropdownSelector = By.css('.Bubble__dropdown_arrow');

    describe('falsy', () => {
      beforeEach(async () => {
        await setInputs({ isDropdown: undefined });
      });
      it('should not render', () => {
        expectRender(dropdownSelector, false);
      });
    });

    describe('truthy', () => {
      describe('and bubble is not clearable', () => {
        beforeEach(async () => {
          await setInputs({
            isDropdown: true,
            isClearable: false,
          });
        });
        it('should render', () => {
          expectRender(dropdownSelector, true);
        });

        describe('and dropdown is open', () => {
          beforeEach(async () => {
            await setInputs({
              isDropdownOpen: true,
            });
          });

          it('should render dropdown icon open', () => {
            expectRender(By.css('.Bubble__dropdown_arrow-open'), true);
          });
        });
      });

      describe('and bubble is clearable', () => {
        describe('and bubble is variant active', () => {
          beforeEach(async () => {
            await setInputs({
              isDropdown: true,
              isClearable: true,
              variant: BUBBLE_VARIANT.ACTIVE,
            });
          });
          it('should render', () => {
            expectRender(dropdownSelector, true);
          });
        });
        describe('and bubble is variant selected', () => {
          beforeEach(async () => {
            await setInputs({
              isDropdown: true,
              isClearable: true,
              variant: BUBBLE_VARIANT.SELECTED,
            });
          });
          it('should not render', () => {
            expectRender(dropdownSelector, false);
          });
        });
      });
    });
  });

  describe('When clearable is...', () => {
    const clearSelector = By.css('.Bubble__clear');
    describe('falsy', () => {
      beforeEach(async () => {
        await setInputs({
          isClearable: false,
        });
      });
      it('should not render clear button', () => {
        expectRender(clearSelector, false);
      });
    });

    describe('truthy', () => {
      describe('and is variant active', () => {
        beforeEach(async () => {
          await setInputs({
            isClearable: true,
            variant: BUBBLE_VARIANT.ACTIVE,
          });
        });
        it('should not render clear button', () => {
          expectRender(clearSelector, false);
        });
      });
      describe('and is variant selected', () => {
        beforeEach(async () => {
          await setInputs({
            isClearable: true,
            variant: BUBBLE_VARIANT.SELECTED,
          });
        });
        it('should render clear button', () => {
          expectRender(clearSelector, true);
        });
      });
    });
  });

  describe('When clicked', () => {
    describe('on bubble', () => {
      it('should execute callback', () => {
        spyOn(component.click, 'emit');
        debugElement.query(By.css('.Bubble')).triggerEventHandler('click', null);

        expect(component.click.emit).toHaveBeenCalledTimes(1);
      });
    });
    describe('on clear', () => {
      beforeEach(async () => {
        await setInputs({
          isClearable: true,
          variant: BUBBLE_VARIANT.SELECTED,
        });
      });
      it('should execute callback', () => {
        spyOn(component.clear, 'emit');
        debugElement.query(By.css('.Bubble__clear')).nativeElement.click();

        expect(component.clear.emit).toHaveBeenCalledTimes(1);
      });
    });
  });

  function setInputs(props: Partial<BubbleComponent>): Promise<void> {
    for (const key of Object.keys(props)) {
      component[key] = props[key];
    }
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function expectTextContent(selector: Predicate<DebugElement>, expectedText: string) {
    expect(debugElement.query(selector).nativeElement.textContent.trim()).toEqual(expectedText);
  }

  function expectRender(selector: Predicate<DebugElement>, isExpectedToRender: boolean): void {
    const element = debugElement.query(selector);

    if (isExpectedToRender) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }
});
