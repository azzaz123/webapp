import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Predicate } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';

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
      beforeEach(async () => {
        await setInputs({ isDropdown: true });
      });
      it('should render', () => {
        expectRender(dropdownSelector, true);
      });
    });
  });

  describe('When clicked', () => {
    let callback: () => void;
    beforeEach(async () => {
      callback = jest.fn();
      await setInputs({ onClick: callback });
    });
    it('should execute callback', () => {
      debugElement.query(By.css('.Bubble')).triggerEventHandler('click', null);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  function setInputs(props: Partial<BubbleComponent>): Promise<void> {
    for (let key of Object.keys(props)) {
      component[key] = props[key];
    }
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function expectRender(
    selector: Predicate<DebugElement>,
    isExpectedToRender: boolean
  ): void {
    const element = debugElement.query(selector);

    if (isExpectedToRender) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }
});
