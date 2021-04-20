import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterGroupComponent } from './filter-group.component';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToggleFilterComponent } from '../toggle-filter/toggle-filter.component';
import { GridSelectFilterComponent } from '../grid-select-filter/grid-select-filter.component';
import { FilterHostComponent } from './components/filter-host/filter-host.component';
import { FilterValuesPipe } from './pipes/filter-values.pipe';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FiltersModule } from '@public/shared/components/filters/filters.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;
  let debugElement: DebugElement;

  const togglePredicate = By.directive(ToggleFilterComponent);
  const gridPredicate = By.directive(GridSelectFilterComponent);
  const values = [{ key: 'key', value: 'true' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterGroupComponent, FilterHostComponent, FilterValuesPipe, FilterHostDirective],
      imports: [CommonModule, FiltersModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGroupComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;

    component.config = [
      {
        id: COMMON_CONFIGURATION_ID.OBJECT_TYPE,
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
    component.values = values;
    component.variant = FILTER_VARIANT.BUBBLE;
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
      const value: FilterParameter[] = [{ key: 'toggle', value: '1' }];
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
});
