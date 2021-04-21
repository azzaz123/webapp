import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHostComponent } from './filter-host.component';
import { Component, ComponentFactoryResolver, DebugElement, Input } from '@angular/core';
import { FilterHostConfig } from './interfaces/filter-host-config.interface';
import { FilterParameter } from '../../../../interfaces/filter-parameter.interface';
import { By } from '@angular/platform-browser';
import { FilterHostDirective } from '../../directives/filter-host.directive';
import { FILTER_VARIANT } from '../../../abstract-filter/abstract-filter.enum';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FilterConfig } from '../../../../interfaces/filter-config.interface';
import { ToggleFilterComponent } from '../../../toggle-filter/toggle-filter.component';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids';
import { FiltersModule } from '@public/shared/components/filters/filters.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'tsl-test-component',
  template: ` <tsl-filter-host [values]="values" [hostConfig]="hostConfig"></tsl-filter-host> `,
})
class TestComponent {
  @Input() hostConfig: FilterHostConfig;
  @Input() values: FilterParameter[];
}

describe('FilterHostComponent', () => {
  let component: FilterHostComponent;
  let debugElement: DebugElement;
  let testComponent: TestComponent;
  let componentFactoryResolver: ComponentFactoryResolver;
  let fixture: ComponentFixture<TestComponent>;

  const filterConfig: FilterConfig<unknown> = {
    type: FILTER_TYPES.TOGGLE,
    bubblePlaceholder: '',
    title: '',
    mapKey: {
      param: 'key',
    },
    id: CAR_CONFIGURATION_ID.WARRANTY,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FilterHostComponent, FilterHostDirective],
      imports: [FiltersModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(FilterHostComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    beforeEach(() => {
      testComponent.hostConfig = {
        variant: FILTER_VARIANT.BUBBLE,
        filterConfig,
        factory: componentFactoryResolver.resolveComponentFactory(ToggleFilterComponent),
      };
      testComponent.values = [];
    });
    it('should render the hosted filter', () => {
      fixture.detectChanges();

      const toggle = debugElement.query(By.directive(ToggleFilterComponent));

      expect(toggle).toBeTruthy();
    });
  });

  describe('on value change', () => {
    beforeEach(() => {
      testComponent.hostConfig = {
        variant: FILTER_VARIANT.BUBBLE,
        filterConfig,
        factory: componentFactoryResolver.resolveComponentFactory(ToggleFilterComponent),
      };
      testComponent.values = [];
      fixture.detectChanges();
    });
    it('should pass the value to the hosted filter', () => {
      const value = [{ key: 'key', value: 'true' }];
      testComponent.values = value;

      fixture.detectChanges();

      const toggle: ToggleFilterComponent = debugElement.query(By.directive(ToggleFilterComponent)).componentInstance;
      expect(toggle.value).toEqual(value);
    });
  });

  describe('on filter value change', () => {
    beforeEach(() => {
      testComponent.hostConfig = {
        variant: FILTER_VARIANT.BUBBLE,
        filterConfig,
        factory: componentFactoryResolver.resolveComponentFactory(ToggleFilterComponent),
      };
      testComponent.values = [];
      fixture.detectChanges();
    });
    it('should emit value change', () => {
      spyOn(component.valueChange, 'emit');
      const value = [{ key: 'key', value: 'true' }];
      const toggle: ToggleFilterComponent = debugElement.query(By.directive(ToggleFilterComponent)).componentInstance;

      toggle.valueChange.emit(value);

      expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
      expect(component.valueChange.emit).toHaveBeenCalledWith(value);
    });
  });

  describe('on filter open state change', () => {
    beforeEach(() => {
      testComponent.hostConfig = {
        variant: FILTER_VARIANT.BUBBLE,
        filterConfig,
        factory: componentFactoryResolver.resolveComponentFactory(ToggleFilterComponent),
      };
      testComponent.values = [];
      fixture.detectChanges();
    });
    it('should emit open state change', () => {
      spyOn(component.openStateChange, 'emit');
      const toggle: ToggleFilterComponent = debugElement.query(By.directive(ToggleFilterComponent)).componentInstance;

      toggle.openStateChange.emit(true);

      expect(component.openStateChange.emit).toHaveBeenCalledTimes(1);
      expect(component.openStateChange.emit).toHaveBeenCalledWith(true);
    });
  });
});