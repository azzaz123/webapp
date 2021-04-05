import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridCheckFormComponent } from './icon-grid-check-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IconGridOption } from '@shared/form/components/icon-grid-check/interfaces/icon-grid-option';
import { DebugElement } from '@angular/core';
import { IconCheckBoxComponent } from '@shared/form/components/icon-grid-check/icon-check-box/icon-check-box.component';
import { By } from '@angular/platform-browser';
import { IconCheckBoxModule } from '@shared/form/components/icon-grid-check/icon-check-box/icon-check-box.module';
import { CommonModule } from '@angular/common';

describe('IconGridCheckFormComponent', () => {
  let component: IconGridCheckFormComponent;
  let fixture: ComponentFixture<IconGridCheckFormComponent>;
  let debugElement: DebugElement;

  const iconPredicate = By.directive(IconCheckBoxComponent);
  const options: IconGridOption[] = [
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
      declarations: [IconGridCheckFormComponent],
      imports: [HttpClientTestingModule, IconCheckBoxModule, CommonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGridCheckFormComponent);
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

      clickIconCheck('Test 1');

      expect(component.onChange).toHaveBeenCalledWith(['test_1']);
    });
  });

  describe('when option value is in value list', () => {
    beforeEach(() => {
      clickIconCheck('Test 1');
      fixture.detectChanges();
    });
    it('should set option as active', () => {
      expect(component.isValueActive('test_1')).toBeTruthy();
    });
  });

  describe('when option is clicked', () => {
    describe('and option was active', () => {
      beforeEach(() => {
        clickIconCheck('Test 1');
        fixture.detectChanges();
      });

      it('should remove the option', () => {
        let iconCheck = findIconCheck('Test 1');
        expect(iconCheck.componentInstance.isActive).toBeTruthy();

        clickIconCheck('Test 1');
        fixture.detectChanges();

        iconCheck = findIconCheck('Test 1');
        expect(iconCheck.componentInstance.isActive).toBeFalsy();
      });
    });

    describe('and option was not active', () => {
      beforeEach(() => {
        clickIconCheck('Test 1');
        fixture.detectChanges();
      });
      describe('and is not multiselect', () => {
        it('should overwrite the value list', () => {
          let icon1 = findIconCheck('Test 1');
          expect(icon1.componentInstance.isActive).toBeTruthy();

          clickIconCheck('Test 2');
          fixture.detectChanges();

          icon1 = findIconCheck('Test 1');
          const icon2 = findIconCheck('Test 2');
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
          let icon1 = findIconCheck('Test 1');
          expect(icon1.componentInstance.isActive).toBeTruthy();

          clickIconCheck('Test 2');
          fixture.detectChanges();

          icon1 = findIconCheck('Test 1');
          const icon2 = findIconCheck('Test 2');
          expect(icon1.componentInstance.isActive).toBeTruthy();
          expect(icon2.componentInstance.isActive).toBeTruthy();
        });
      });
    });
  });

  function clickIconCheck(label: string): void {
    const iconCheck = findIconCheck(label);
    iconCheck.nativeElement.click();
  }

  function findIconCheck(label: string): DebugElement {
    return debugElement.queryAll(iconPredicate).find((debug) => debug.componentInstance.label === label);
  }
});
