import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterGroup } from './classes/filter-group';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;
  let filterFactoryService: FilterFactoryService;
  const values = [{ key: 'key', value: 'true' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterGroupComponent],
      imports: [CommonModule],
      providers: [
        {
          provide: FilterFactoryService,
          useValue: {
            insertFilters() {},
            filterGroup: new FilterGroup([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGroupComponent);
    component = fixture.componentInstance;
    filterFactoryService = TestBed.inject(FilterFactoryService);

    component.config = [
      {
        id: 'id',
        type: FILTER_TYPES.TOGGLE,
        mapKey: {
          key: 'key',
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

  it('should insert filters', () => {
    spyOn(filterFactoryService, 'insertFilters');

    component.ngAfterViewInit();

    expect(filterFactoryService.insertFilters).toHaveBeenCalledWith(component.config, values, component.variant, component.filterHosts);
  });

  describe('when filter group value changes', () => {
    it('should emit value changes', () => {
      const value: FilterParameter[] = [];
      spyOn(component.valueChange, 'emit');

      component['filterGroup']['_valueChange'].next(value);

      expect(component.valueChange.emit).toHaveBeenCalledWith(value);
    });
  });

  describe('when filter group open state changes', () => {
    it('should emit open state changes', () => {
      const value = true;
      spyOn(component.openStateChange, 'emit');

      component['filterGroup']['_openStateChange'].next(value);

      expect(component.openStateChange.emit).toHaveBeenCalledWith(value);
    });
  });

  describe('when some filter value is cleared', () => {
    it('should emit clean', () => {
      const value: FilterParameter[] = [];
      spyOn(component.clear, 'emit');

      component['filterGroup']['_clear'].next(value);

      expect(component.clear.emit).toHaveBeenCalledWith(value);
    });
  });
});
