import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import {
  optionsFixture,
  extendedOptionsFixture,
  extendedOptionsWithChildrenFixture,
  optionsWithChildrenFixture,
} from './fixtures/multi-select-option.fixtures';
import { MultiSelectFormComponent } from './multi-select-form.component';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option/multi-select-option.component';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

export const value = ['bb', 'cc'];

export const valueWithChildren = ['aa2', 'bb', 'cc'];

describe('MultiSelectFormComponent', () => {
  let component: MultiSelectFormComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MultiSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, FormsModule, MultiSelectOptionModule, SvgIconModule],
      declarations: [MultiSelectFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when some value is assigned', () => {
    describe('and options does not have chidren', () => {
      it('should update extendedOptions accordingly', (done) => {
        component.options = optionsFixture;
        component.writeValue(value);
        fixture.detectChanges();

        component.extendedOptions$.subscribe((extendedOptions) => {
          expect(extendedOptions).toEqual(extendedOptionsFixture);
          done();
        });
      });

      it('should update the template accordingly', () => {
        component.options = optionsFixture;
        component.writeValue(value);
        fixture.detectChanges();

        const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));
        value.forEach((value) => {
          const checkedOption = options.find((option) => {
            return option.componentInstance.option.value === value;
          });

          expect(checkedOption.componentInstance.option.checked).toBeTruthy();
        });
      });
    });

    describe('and options have chidren', () => {
      it('should update extendedOptions accordingly', (done) => {
        component.options = optionsWithChildrenFixture;
        component.writeValue(valueWithChildren);
        fixture.detectChanges();

        component.extendedOptions$.subscribe((extendedOptions) => {
          expect(extendedOptions).toEqual(extendedOptionsWithChildrenFixture);
          done();
        });
      });
    });
  });

  describe('when no value', () => {
    it('should load the options with unchecked checkbox', () => {
      component.options = optionsFixture;
      component.writeValue([]);
      fixture.detectChanges();

      const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));
      const checkedOptions = options.find((option) => {
        return option.componentInstance.option.checked === true;
      });

      expect(checkedOptions).toBeUndefined();
    });
  });

  describe('when changing value', () => {
    describe('and options does not have chidren', () => {
      it('should set value acordingly', () => {
        component.options = optionsFixture;
        fixture.detectChanges();

        const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));
        const optionToBeChecked: MultiSelectOptionComponent = options[2].componentInstance;
        optionToBeChecked.option.checked = true;
        optionToBeChecked.toggleCheckbox();

        expect(component.value).toEqual([optionToBeChecked.option.value]);
      });
    });

    describe('and options have chidren', () => {
      const parentOptionValue = 'aa';

      beforeEach(() => {
        component.options = optionsWithChildrenFixture;
        component['shownChildrenOptionIdSubject'].next(parentOptionValue);
        fixture.detectChanges();
      });

      describe('and not all childrens are checked', () => {
        it('should set value acordingly', () => {
          const childOptions = debugElement.queryAll(By.directive(MultiSelectOptionComponent));
          const childOptionToBeChecked: MultiSelectOptionComponent = childOptions[1].componentInstance;
          const childOptionToBeChecked2: MultiSelectOptionComponent = childOptions[2].componentInstance;

          childOptionToBeChecked.option.checked = true;
          childOptionToBeChecked.toggleCheckbox();
          childOptionToBeChecked2.option.checked = true;
          childOptionToBeChecked2.toggleCheckbox();

          expect(component.value).toEqual([childOptionToBeChecked.option.value, childOptionToBeChecked2.option.value]);
        });
      });

      describe('and all childrens are checked', () => {
        it('should set value acordingly', () => {
          const childOptions = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

          childOptions.forEach((childOption) => {
            childOption.componentInstance.option.checked = true;
            childOption.componentInstance.toggleCheckbox();
          });

          expect(component.value).toEqual([parentOptionValue]);
        });
      });
    });
  });

  describe('when asking to select all child options', () => {
    const parentOptionValue = 'aa';

    beforeEach(() => {
      component.options = optionsWithChildrenFixture;
      component['shownChildrenOptionIdSubject'].next(parentOptionValue);
      fixture.detectChanges();
    });

    it('should set value acordingly', () => {
      component.selectAllChildren(extendedOptionsWithChildrenFixture[0]);

      expect(component.value).toEqual([parentOptionValue]);
    });

    it('should check all options', () => {
      component.selectAllChildren(extendedOptionsWithChildrenFixture[0]);
      const childOptions = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

      childOptions.forEach((childOption: DebugElement) => {
        expect(childOption.componentInstance.option.checked).toBeTruthy;
      });
    });
  });

  describe('when asking to unselect all child options', () => {
    const parentOptionValue = 'aa';

    beforeEach(() => {
      component.options = optionsWithChildrenFixture;
      component.writeValue([parentOptionValue]);
      component['shownChildrenOptionIdSubject'].next(parentOptionValue);
      fixture.detectChanges();
    });

    it('should set value acordingly', () => {
      component.unselectAllChildren(extendedOptionsWithChildrenFixture[0]);

      expect(component.value).toEqual([]);
    });

    it('should uncheck all options', () => {
      component.unselectAllChildren(extendedOptionsWithChildrenFixture[0]);
      const childOptions = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

      childOptions.forEach((childOption: DebugElement) => {
        expect(childOption.componentInstance.option.checked).toBeFalsy;
      });
    });
  });

  describe('when asking to unselect all options', () => {
    beforeEach(() => {
      component.options = optionsFixture;
      component.writeValue(value);
      fixture.detectChanges();
    });

    it('should set value acordingly', () => {
      component.unselectAll();

      expect(component.value).toEqual([]);
    });

    it('should uncheck all options', () => {
      component.unselectAll();
      const options = debugElement.queryAll(By.directive(MultiSelectOptionComponent));

      options.forEach((option: DebugElement) => {
        expect(option.componentInstance.option.checked).toBeFalsy;
      });
    });
  });
});
