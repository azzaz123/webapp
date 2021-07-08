import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { MultiSelectFormComponent, MultiSelectFormOption, MultiSelectValue } from './multi-select-form.component';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option/multi-select-option.component';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

export const checkedValue: MultiSelectValue = ['aa', 'cc'];

export const multiSelectedOptionsFixture: SelectFormOption<string>[] = [
  { label: 'aa', value: 'aa' },
  { label: 'bb', value: 'bb' },
  { label: 'cc', value: 'cc' },
  { label: 'dd', value: 'dd' },
];

export const toggledExtendedOptions: MultiSelectFormOption[] = [
  { label: 'aa', value: 'aa', checked: false },
  { label: 'bb', value: 'bb', checked: true },
  { label: 'cc', value: 'cc', checked: true },
  { label: 'dd', value: 'dd', checked: false },
];

describe('MultiSelectFormComponent', () => {
  let component: MultiSelectFormComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MultiSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, FormsModule, MultiSelectOptionModule],
      declarations: [MultiSelectFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.options = multiSelectedOptionsFixture;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we already have the checked value', () => {
    it('should load the options with checkboxes checked accordingly', () => {
      component.writeValue(checkedValue);
      fixture.detectChanges();

      const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

      expect(options[0].componentInstance.option.checked).toBeTruthy();
      expect(options[2].componentInstance.option.checked).toBeTruthy();
      expect(options[1].componentInstance.option.checked).toBeFalsy();
    });
  });

  describe('when we dont have checked value', () => {
    it('should load the options with unchecked checkbox', () => {
      const expectedOptions = multiSelectedOptionsFixture.map((option) => {
        return { ...option, checked: false };
      });
      fixture.detectChanges();

      const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

      expect(options.length).toBe(multiSelectedOptionsFixture.length);
      expect(component.extendedOptions).toEqual(expectedOptions);
    });
  });

  describe('Multi select behavior', () => {
    it('should have multiple values when multiple options are checked', () => {
      spyOn(component, 'handleSelectedOption').and.callThrough();
      spyOn(component, 'onChange');
      const selectedValue = toggledExtendedOptions
        .filter((option) => {
          return option.checked === true;
        })
        .map((option) => {
          return option.value;
        });

      component.extendedOptions = toggledExtendedOptions;
      component.handleSelectedOption();
      fixture.detectChanges();

      expect(component.onChange).toHaveBeenCalledWith(selectedValue);
    });
  });
});
