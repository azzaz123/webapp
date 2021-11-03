import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterGroupComponent } from './filter-group.component';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { Component, DebugElement, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToggleFilterComponent } from '../toggle-filter/toggle-filter.component';
import { GridSelectFilterComponent } from '../grid-select-filter/grid-select-filter.component';
import { FilterHostComponent } from './components/filter-host/filter-host.component';
import { FilterValuesPipe } from './pipes/filter-values.pipe';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FiltersModule } from '@public/shared/components/filters/filters.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SelectFilterComponent } from '@public/shared/components/filters/components/select-filter/select-filter.component';
import { HostVisibilityService } from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../../core/enums/configuration-ids/consumer-goods-configuration-ids.enum';

@Component({
  selector: 'tsl-test-component',
  template: ` <tsl-filter-group [values]="values" [config]="config" [variant]="variant"></tsl-filter-group> `,
})
class TestComponent {
  @Input() values: FilterParameter[];
  @Input() config: FilterConfig<unknown>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
}

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  const togglePredicate = By.directive(ToggleFilterComponent);
  const selectPredicate = By.directive(SelectFilterComponent);
  const gridPredicate = By.directive(GridSelectFilterComponent);
  const values = [{ key: FILTER_QUERY_PARAM_KEY.warranty, value: 'true' }];

  const initialConfig: FilterConfig<unknown>[] = [
    {
      id: COMMON_CONFIGURATION_ID.CATEGORIES,
      type: FILTER_TYPES.TOGGLE,
      mapKey: {
        key: 'toggle',
      },
      title: 'title',
      bubblePlaceholder: 'bubblePlaceholder',
    },
    {
      id: COMMON_CONFIGURATION_ID.POSTED_AGO,
      type: FILTER_TYPES.GRID,
      mapKey: {
        key: 'grid',
      },
      title: 'title',
      bubblePlaceholder: 'bubblePlaceholder',
    },
  ];

  const modifiedConfig: FilterConfig<unknown>[] = [
    {
      id: FASHION_CONFIGURATION_ID.GENDER,
      type: FILTER_TYPES.SELECT,
      mapKey: {
        key: 'gender',
      },
      title: 'title',
      bubblePlaceholder: 'bubblePlaceholder',
    },
    {
      id: COMMON_CONFIGURATION_ID.POSTED_AGO,
      type: FILTER_TYPES.GRID,
      mapKey: {
        key: 'grid',
      },
      title: 'title',
      bubblePlaceholder: 'bubblePlaceholder',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FilterGroupComponent, FilterHostComponent, FilterValuesPipe, FilterHostDirective],
      imports: [CommonModule, FiltersModule, HttpClientTestingModule],
      providers: [
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        HostVisibilityService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(FilterGroupComponent)).componentInstance;

    testComponent.config = initialConfig;
    testComponent.values = values;
    testComponent.variant = FILTER_VARIANT.CONTENT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render configured filters', () => {
    const toggle = debugElement.query(togglePredicate);
    const grid = debugElement.query(gridPredicate);

    expect(toggle).toBeTruthy();
    expect(grid).toBeTruthy();
  });

  describe('when filter value changes', () => {
    it('should emit value changes', () => {
      const value: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.warranty, value: '1' }];
      spyOn(component.valueChange, 'emit');

      const grid: GridSelectFilterComponent = debugElement.query(gridPredicate).componentInstance;
      grid.valueChange.emit(value);

      expect(component.valueChange.emit).toHaveBeenCalledWith(value);
    });
  });

  describe('when filter open state changes', () => {
    it('should emit open state changes', () => {
      spyOn(component.openStateChange, 'emit');

      const grid: GridSelectFilterComponent = debugElement.query(gridPredicate).componentInstance;
      grid.openStateChange.emit(true);

      expect(component.openStateChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('when filter group config changes', () => {
    beforeEach(() => {
      testComponent.config = modifiedConfig;
      fixture.detectChanges();
    });

    it('should render updated filters', () => {
      const gender = debugElement.query(selectPredicate);
      const grid = debugElement.query(gridPredicate);

      expect(gender).toBeTruthy();
      expect(grid).toBeTruthy();
    });
  });

  describe('when filter group config has no changes but has a refreshable filter', () => {
    beforeEach(() => {
      spyOn<any>(component, 'updateHostConfigs');
      const configWithRefreshableFilter = [
        ...initialConfig,
        {
          id: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.OBJECT_TYPE,
          type: FILTER_TYPES.MULTISELECT,
          title: 'title',
          bubblePlaceholder: 'bubblePlaceholder',
          mapKey: {
            parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
          },
        },
      ];
      const changes: SimpleChanges = { config: new SimpleChange(configWithRefreshableFilter, configWithRefreshableFilter, false) };

      component.ngOnChanges(changes);
      fixture.detectChanges();
    });

    it('should update host config to refresh values', () => {
      expect(component['updateHostConfigs']).toHaveBeenCalled();
    });
  });
});
