import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterGroup } from './classes/filter-group';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;
  let filterFactoryService: FilterFactoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterGroupComponent],
      imports: [CommonModule],
      providers: [
        {
          provide: FilterFactoryService,
          useValue: {
            insertFilters() {},
            getFilterGroup() {
              return new FilterGroup([]);
            },
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
    component.initialValues = [{ key: 'key', value: 'true' }];
    component.variant = FILTER_VARIANT.BUBBLE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should insert filters', () => {
    spyOn(filterFactoryService, 'insertFilters');

    component.ngAfterViewInit();

    expect(filterFactoryService.insertFilters).toHaveBeenCalledWith(
      component.config,
      component.initialValues,
      component.variant,
      component.query
    );
  });
});
