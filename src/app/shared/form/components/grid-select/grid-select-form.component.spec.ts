import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSelectFormComponent } from './grid-select-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { DebugElement } from '@angular/core';
import { GridSelectOptionComponent } from '@shared/form/components/grid-select/grid-select-option/grid-select-option.component';
import { By } from '@angular/platform-browser';
import { GridSelectOptionModule } from '@shared/form/components/grid-select/grid-select-option/grid-select-option.module';
import { CommonModule } from '@angular/common';

describe('GridSelectFormComponent', () => {
  let component: GridSelectFormComponent;
  let fixture: ComponentFixture<GridSelectFormComponent>;
  let debugElement: DebugElement;

  const optionPredicate = By.directive(GridSelectOptionComponent);
  const options: GridSelectFormOption[] = [
    {
      label: 'Test 1',
      value: 'test_1',
      icon: 'icon.svg',
    },
    {
      label: 'Test 2',
      value: 'test_2',
      icon: 'icon.svg',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridSelectFormComponent],
      imports: [HttpClientTestingModule, GridSelectOptionModule, CommonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSelectFormComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.options = options;
    component.columns = 4;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when value changes', () => {
    it('should call value change', () => {
      spyOn(component, 'onChange');

      clickGridSelectOption('Test 1');

      expect(component.onChange).toHaveBeenCalledWith(['test_1']);
    });
  });

  describe('when option value is in value list', () => {
    beforeEach(() => {
      clickGridSelectOption('Test 1');
      fixture.detectChanges();
    });
    it('should set option as active', () => {
      expect(component.isValueActive('test_1')).toBeTruthy();
    });
  });

  describe('when option is clicked', () => {
    describe('and option was active', () => {
      beforeEach(() => {
        clickGridSelectOption('Test 1');
        fixture.detectChanges();
      });

      it('should remove the option', () => {
        let gridSelectOption = findGridSelectOption('Test 1');
        expect(gridSelectOption.componentInstance.isActive).toBeTruthy();

        clickGridSelectOption('Test 1');
        fixture.detectChanges();

        gridSelectOption = findGridSelectOption('Test 1');
        expect(gridSelectOption.componentInstance.isActive).toBeFalsy();
      });
    });

    describe('and option was not active', () => {
      beforeEach(() => {
        clickGridSelectOption('Test 1');
        fixture.detectChanges();
      });
      describe('and is not multiselect', () => {
        it('should overwrite the value list', () => {
          let option1 = findGridSelectOption('Test 1');
          expect(option1.componentInstance.isActive).toBeTruthy();

          clickGridSelectOption('Test 2');
          fixture.detectChanges();

          option1 = findGridSelectOption('Test 1');
          const option2 = findGridSelectOption('Test 2');
          expect(option1.componentInstance.isActive).toBeFalsy();
          expect(option2.componentInstance.isActive).toBeTruthy();
        });
      });
      describe('and is multiselect', () => {
        beforeEach(() => {
          component.isMultiselect = true;
          fixture.detectChanges();
        });
        it('should add to the value list', () => {
          let option1 = findGridSelectOption('Test 1');
          expect(option1.componentInstance.isActive).toBeTruthy();

          clickGridSelectOption('Test 2');
          fixture.detectChanges();

          option1 = findGridSelectOption('Test 1');
          const option2 = findGridSelectOption('Test 2');
          expect(option1.componentInstance.isActive).toBeTruthy();
          expect(option2.componentInstance.isActive).toBeTruthy();
        });
      });
    });
  });

  function clickGridSelectOption(label: string): void {
    const option = findGridSelectOption(label);
    option.nativeElement.click();
  }

  function findGridSelectOption(label: string): DebugElement {
    return debugElement.queryAll(optionPredicate).find((debug) => debug.componentInstance.label === label);
  }
});
