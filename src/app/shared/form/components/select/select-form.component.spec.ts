import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormComponent } from './select-form.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SelectOptionComponent } from '@shared/form/components/select/select-option/select-option.component';
import { SelectOptionModule } from '@shared/form/components/select/select-option/select-option.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('SelectFormComponent', () => {
  let component: SelectFormComponent;
  let fixture: ComponentFixture<SelectFormComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionModule, HttpClientTestingModule, FormsModule, CommonModule],
      declarations: [SelectFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFormComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.options = [
      {
        label: 'Option 1',
        value: 'option_1',
      },
      {
        label: 'Option 2',
        value: 'option_2',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all the options', () => {
    const options = debugElement.queryAll(By.directive(SelectOptionComponent));

    expect(options.length).toEqual(2);
  });

  describe('when no value is provided', () => {
    it('should have no active option', () => {
      const options = debugElement.queryAll(By.directive(SelectOptionComponent));

      const activeOption = options.find((option) => option.componentInstance.isActive);

      expect(activeOption).toBeFalsy();
    });
  });

  describe('when value is provided', () => {
    beforeEach(() => {
      component.writeValue('option_2');
      fixture.detectChanges();
    });
    it('should mark corresponding option as active', () => {
      const options = debugElement.queryAll(By.directive(SelectOptionComponent));

      const activeOption = options.find((option) => option.componentInstance.isActive);

      expect(activeOption.componentInstance.label).toEqual('Option 2');
    });
  });

  describe('when option is selected', () => {
    it('should set selected option to active', () => {
      debugElement.query(By.directive(SelectOptionComponent)).nativeElement.click();
      fixture.detectChanges();

      const activeOption = debugElement.queryAll(By.directive(SelectOptionComponent)).find((option) => option.componentInstance.isActive);

      expect(activeOption.componentInstance.label).toEqual('Option 1');
    });

    it('should emit onChange', () => {
      spyOn(component, 'onChange');

      debugElement.query(By.directive(SelectOptionComponent)).nativeElement.click();

      expect(component.onChange).toHaveBeenCalledWith('option_1');
    });
  });
});
