import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CheckboxFormModule } from '@shared/form/components/checkbox/checkbox-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { extendedOptionsWithChildrenFixture, optionsWithChildrenFixture } from '../../fixtures/multi-select-option.fixtures';
import { TemplateMultiSelectFormOption } from '../../interfaces/multi-select-form-option.interface';
import { MultiSelectOptionComponent } from './multi-select-option.component';

export const optionFixture: TemplateMultiSelectFormOption = {
  label: 'aa',
  value: 'aa',
  checked: true,
};

export const optionWithSublabelFixture: TemplateMultiSelectFormOption = {
  label: 'bb',
  sublabel: '3',
  value: 'bb',
  checked: true,
};

export const optionWithChildrenFixture: TemplateMultiSelectFormOption = extendedOptionsWithChildrenFixture[0];

describe('MultiSelectOptionComponent', () => {
  let component: MultiSelectOptionComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MultiSelectOptionComponent>;
  const queryLabelNode = '.MultiSelectOption__label';
  const querySublabel = '.MultiSelectOption__label__sub';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CheckboxFormModule, SvgIconModule, HttpClientTestingModule],
      declarations: [MultiSelectOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectOptionComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when option', () => {
    describe('does not have sub label', () => {
      beforeEach(() => {
        component.option = optionFixture;
        fixture.detectChanges();
      });
      it('should only show option with label', () => {
        const label = debugElement.query(By.css(queryLabelNode)).nativeElement;
        const subLabel = debugElement.query(By.css(querySublabel));
        expect(label.textContent.trim()).toBe(optionFixture.label);
        expect(subLabel).toBeNull();
      });
    });

    describe('has sublabel', () => {
      beforeEach(() => {
        component.option = optionWithSublabelFixture;
        fixture.detectChanges();
      });

      it('should show option with label and sublabel', () => {
        const label = debugElement.query(By.css(queryLabelNode)).nativeElement;
        const sublabel = debugElement.query(By.css(querySublabel)).nativeElement;

        expect(label.textContent.trim()).toBe(optionWithSublabelFixture.label);
        expect(sublabel.textContent.trim()).toBe(optionWithSublabelFixture.sublabel);
      });
    });

    describe('has children', () => {
      beforeEach(() => {
        component.option = optionWithChildrenFixture;
        component.hasChildren = true;
        fixture.detectChanges();
      });

      it('should show arrow instead of checkbox', () => {
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');
        const arrow = debugElement.nativeElement.querySelector('tsl-svg-icon');

        expect(checkbox).toBeFalsy();
        expect(arrow).toBeTruthy();
      });

      it('should add correct class', () => {
        const elementSelector = '.MultiSelectOption';
        const expectedClass = 'MultiSelectOption--with-children';

        expect(fixture.debugElement.query(By.css(elementSelector)).classes[expectedClass]).toBeTruthy();
      });

      describe('and has some of them selected', () => {
        beforeEach(() => {
          component.option = optionWithChildrenFixture;
          fixture.detectChanges();
        });

        it('should accordingly update selected children count', () => {
          expect(component.selectedChildrenCount).toEqual(1);
        });
      });
    });

    describe('has not children', () => {
      beforeEach(() => {
        component.option = optionWithSublabelFixture;
        component.hasChildren = false;
        fixture.detectChanges();
      });

      it('should show arrow instead of checkbox', () => {
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');
        const arrow = debugElement.nativeElement.querySelector('tsl-svg-icon');

        expect(checkbox).toBeTruthy();
        expect(arrow).toBeFalsy();
      });
    });

    describe('is toggled by the user', () => {
      beforeEach(() => {
        component.option = optionFixture;
        component.hasChildren = false;
        fixture.detectChanges();
      });

      it('should toggle checkbox ', () => {
        spyOn(component.toggleOnChange, 'emit');
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');

        checkbox.click();

        expect(component.toggleOnChange.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('is disabled', () => {
      beforeEach(() => {
        component.option = optionFixture;
        component.isDisabled = true;
        fixture.detectChanges();
      });
      it('should not change the value on user click', () => {
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');
        const initialValue = component.data.checked;

        checkbox.click();

        expect(component.data.checked).toEqual(initialValue);
      });

      it('should add correct class', () => {
        const elementSelector = '.MultiSelectOption';
        const expectedClass = 'MultiSelectOption--disabled';

        expect(fixture.debugElement.query(By.css(elementSelector)).classes[expectedClass]).toBeTruthy();
      });
    });
  });
});
