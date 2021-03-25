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

@Component({
  template: `<div tslFilterHost></div>`,
})
class TestComponent {
  @ViewChildren(FilterHostDirective) host: QueryList<FilterHostDirective>;
}

describe('FilterFactoryService', () => {
  let service: FilterFactoryService;
  let component: TestComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;

  const toggleFilterSelector = 'tsl-toggle-filter';

  const config: FilterConfig<any>[] = [
    {
      id: 'id',
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
    de = fixture.debugElement;
    el = de.nativeElement;

    fixture.detectChanges();
  });

  it('should create test component', () => {
    expect(component).toBeTruthy();
  });

  describe('when inserting filters', () => {
    it('should insert it on the template', () => {
      service.insertFilters(config, value, variant, component.host);

      expect(el.querySelector(toggleFilterSelector)).toBeTruthy();
    });

    it('should add it correctly to the form group', () => {
      service.insertFilters(config, value, variant, component.host);

      service.filterGroup['filters'].forEach((filter: AbstractFilter<unknown>, index: number) => {
        expect(filter).toBeInstanceOf(FILTER_TYPE_COMPONENT[config[index].type]);
      });
    });
  });
});
