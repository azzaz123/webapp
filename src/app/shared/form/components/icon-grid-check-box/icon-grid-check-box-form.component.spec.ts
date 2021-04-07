import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridCheckBoxFormComponent } from './icon-grid-check-box-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IconGridCheckBoxOption } from '@shared/form/components/icon-grid-check-box/interfaces/icon-grid-check-box-option.interface';
import { DebugElement } from '@angular/core';
import { GridSelectOptionComponent } from '@shared/form/components/icon-grid-check-box/grid-select-option/grid-select-option.component';
import { By } from '@angular/platform-browser';
import { GridSelectOptionModule } from '@shared/form/components/icon-grid-check-box/grid-select-option/grid-select-option.module';
import { CommonModule } from '@angular/common';

describe('IconGridCheckBoxFormComponent', () => {
  let component: IconGridCheckBoxFormComponent;
  let fixture: ComponentFixture<IconGridCheckBoxFormComponent>;
  let debugElement: DebugElement;

  const iconPredicate = By.directive(GridSelectOptionComponent);
  const options: IconGridCheckBoxOption[] = [
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
      declarations: [IconGridCheckBoxFormComponent],
      imports: [HttpClientTestingModule, GridSelectOptionModule, CommonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGridCheckBoxFormComponent);
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
          let icon1 = findGridSelectOption('Test 1');
          expect(icon1.componentInstance.isActive).toBeTruthy();

          clickGridSelectOption('Test 2');
          fixture.detectChanges();

          icon1 = findGridSelectOption('Test 1');
          const icon2 = findGridSelectOption('Test 2');
          expect(icon1.componentInstance.isActive).toBeFalsy();
          expect(icon2.componentInstance.isActive).toBeTruthy();
        });
      });
      describe('and is multiselect', () => {
        beforeEach(() => {
          component.isMultiselect = true;
          fixture.detectChanges();
        });
        it('should add to the value list', () => {
          let icon1 = findGridSelectOption('Test 1');
          expect(icon1.componentInstance.isActive).toBeTruthy();

          clickGridSelectOption('Test 2');
          fixture.detectChanges();

          icon1 = findGridSelectOption('Test 1');
          const icon2 = findGridSelectOption('Test 2');
          expect(icon1.componentInstance.isActive).toBeTruthy();
          expect(icon2.componentInstance.isActive).toBeTruthy();
        });
      });
    });
  });

  function clickGridSelectOption(label: string): void {
    const option = findGridSelectOption(label);
    option.nativeElement.click();
  }

  function findGridSelectOption(label: string): DebugElement {
    return debugElement.queryAll(iconPredicate).find((debug) => debug.componentInstance.label === label);
  }
});
