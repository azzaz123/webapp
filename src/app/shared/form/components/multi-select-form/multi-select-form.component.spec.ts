import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { SelectOptionComponent } from '../select/select-option/select-option.component';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option/multi-select-option.component';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

export const multiSelectedOptionsFixture: SelectFormOption<string>[] = [
  { label: 'aa', value: 'aa' },
  { label: 'bb', value: 'bb' },
  { label: 'cc', value: 'cc' },
  { label: 'dd', value: 'dd' },
];

describe('MultiSelectFormComponent', () => {
  let component: MultiSelectFormComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MultiSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, FormsModule, MultiSelectOptionModule],
      declarations: [MultiSelectFormComponent],
    })
      .overrideComponent(MultiSelectFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
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

  it('should show load the options mapped with checked value', () => {
    const expectedOptions = multiSelectedOptionsFixture.map((option) => {
      return { ...option, checked: false };
    });
    fixture.detectChanges();

    const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

    expect(options.length).toBe(multiSelectedOptionsFixture.length);
    expect(component.extendedOptions).toEqual(expectedOptions);
  });

  it('should disable the checking behavior if we stop letting users to select options', () => {
    component.isDisabled = true;
    fixture.detectChanges();

    const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));
    const isDisabled = options.find((option) => {
      option.componentInstance.isDisabled === false;
    });

    expect(isDisabled).toBeFalsy();
  });

  describe('Multi select behavior', () => {
    it('should have multiple values when multiple options are checked', () => {
      component.options = multiSelectedOptionsFixture;
      fixture.detectChanges();
      spyOn(component, 'handleSelectedOption');
      spyOn(component, 'onChange');

      const hostChildElement: HTMLElement = debugElement.queryAll(By.directive(MultiSelectOptionComponent))[1].nativeElement;
      const option1: HTMLInputElement = hostChildElement.querySelector('input');
      option1.dispatchEvent(new Event('change'));

      expect(component.handleSelectedOption).toHaveBeenCalled();
      expect(component.onChange).toHaveBeenCalled();
      expect(component.extendedOptions).toBe('');
    });
  });
});
