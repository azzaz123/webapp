import { CommonModule } from '@angular/common';
import { Component, DebugElement, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '../../../core/enums/filter-types/filter-types.enum';
import { FiltersModule } from '../../../filters.module';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { FILTER_TYPE_COMPONENT } from '../constants/filter-type-component.constant';
import { FilterHostDirective } from '../directives/filter-host.directive';
import { FilterFactoryService } from './filter-factory.service';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { By } from '@angular/platform-browser';
import { ToggleFilterComponent } from '../../toggle-filter/toggle-filter.component';

@Component({
  template: `<div tslFilterHost></div>`,
})
class TestComponent {
  @ViewChildren(FilterHostDirective) host: QueryList<FilterHostDirective>;
}

describe('FilterFactoryService', () => {
  let service: FilterFactoryService;
  let component: TestComponent;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;

  const toggleFilterSelector = 'tsl-toggle-filter';

  const config: FilterConfig<any>[] = [
    {
      id: COMMON_CONFIGURATION_ID.OBJECT_TYPE,
      type: FILTER_TYPES.TOGGLE,
      mapKey: {
        key: 'key',
      },
      title: 'How much do you want to pay?',
      icon: '/assets/icons/joke.svg',
      bubblePlaceholder: 'Price',
    },
  ];

  const value: FilterParameter[] = [{ key: 'key', value: 'true' }];

  const variant = FILTER_VARIANT.BUBBLE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FilterHostDirective],
      imports: [CommonModule, FiltersModule],
      providers: [FilterFactoryService],
    }).compileComponents();

    service = TestBed.inject(FilterFactoryService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create test component', () => {
    expect(component).toBeTruthy();
  });

  describe('when inserting filters', () => {
    it('should insert it on the template', () => {
      service.insertFilters(config, value, variant, component.host);

      expect(nativeElement.querySelector(toggleFilterSelector)).toBeTruthy();
    });

    it('should add it correctly to the form group', () => {
      service.insertFilters(config, value, variant, component.host);

      service.getFilterGroup(variant)['filters'].forEach((filter: AbstractFilter<unknown>, index: number) => {
        expect(filter).toBeInstanceOf(FILTER_TYPE_COMPONENT[config[index].type]);
      });
    });

    describe('and value is provided', () => {
      it('should pass the value to the filter', () => {
        service.insertFilters(config, value, variant, component.host);

        const toggle: ToggleFilterComponent = debugElement.query(By.directive(ToggleFilterComponent)).componentInstance;
        expect(toggle.value).toEqual(value);
      });
    });

    describe('and no value is provided', () => {
      it('should not pass value to the filter', () => {
        service.insertFilters(config, [], variant, component.host);

        const toggle: ToggleFilterComponent = debugElement.query(By.directive(ToggleFilterComponent)).componentInstance;
        expect(toggle.value).toEqual([]);
      });
    });
  });
});
