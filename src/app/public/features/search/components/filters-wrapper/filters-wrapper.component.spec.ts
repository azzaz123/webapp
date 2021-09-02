import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersWrapperComponent } from './filters-wrapper.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupComponentStub } from '@public/shared/components/filters/components/filter-group/services/filter-group.component.stub';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FilterGroupConfigurationService } from '@public/shared/services/filter-group-configuration/filter-group-configuration.service';
import { ExtractFilterConfigsPipe } from '@public/features/search/components/filters-wrapper/pipes/extract-filter-configs.pipe';
import { DrawerComponent } from '@public/shared/components/drawer/drawer.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';

@Component({
  selector: 'tsl-test-component',
  template: ` <tsl-filters-wrapper></tsl-filters-wrapper> `,
})
class TestComponent {}

describe('FiltersWrapperComponent', () => {
  let component: FiltersWrapperComponent;
  let drawerStore: FilterParameterStoreService;
  let bubbleStore: FilterParameterStoreService;
  let navigator: SearchNavigatorService;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  const drawerPredicate = By.directive(DrawerComponent);
  const filtersButton = By.css('.FiltersWrapper__bar > .m-1');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FiltersWrapperComponent, FilterGroupComponentStub, ExtractFilterConfigsPipe],
      imports: [
        BubbleModule,
        DrawerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'search',
            redirectTo: '',
          },
        ]),
      ],
      providers: [
        FilterGroupConfigurationService,
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        SearchQueryStringService,
        QueryStringLocationService,
        { provide: CookieService, useValue: MockCookieService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    bubbleStore = TestBed.inject<FilterParameterStoreService>(FILTER_PARAMETER_STORE_TOKEN);
    drawerStore = TestBed.inject<FilterParameterStoreService>(FILTER_PARAMETER_DRAFT_STORE_TOKEN);
    navigator = TestBed.inject(SearchNavigatorService);
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(FiltersWrapperComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking the filter button', () => {
    describe('if drawer was previously opened', () => {
      beforeEach(() => {
        component.drawerConfig.isOpen = true;
        fixture.detectChanges();
      });

      it('should close the drawer', () => {
        spyOn(component, 'closeDrawer').and.callThrough();

        debugElement.query(filtersButton).nativeElement.click();
        fixture.detectChanges();

        expect(component.closeDrawer).toHaveBeenCalledTimes(1);
        expect(component.drawerConfig.isOpen).toBeFalsy();
      });
    });

    describe('if drawer was previously closed', () => {
      beforeEach(() => {
        component.drawerConfig.isOpen = false;
        fixture.detectChanges();
      });

      it('should open the drawer', () => {
        debugElement.query(filtersButton).nativeElement.click();
        fixture.detectChanges();

        expect(component.drawerConfig.isOpen).toBeTruthy();
      });
    });
  });

  describe('when closing the drawer', () => {
    const initialValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '100' }];
    const newValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }];
    beforeEach(() => {
      component.drawerConfig.isOpen = true;
      bubbleStore.setParameters(initialValues);
      drawerStore.setParameters(newValues);
      fixture.detectChanges();
    });

    it('should close the drawer', () => {
      component.closeDrawer();

      expect(component.drawerConfig.isOpen).toBeFalsy();
    });

    it('should recover initial values', () => {
      spyOn(drawerStore, 'setParameters');

      component.closeDrawer();

      expect(drawerStore.setParameters).toHaveBeenCalledTimes(1);
      expect(drawerStore.setParameters).toHaveBeenCalledWith(initialValues);
    });
  });

  describe('when applying the drawer', () => {
    beforeEach(() => {
      component.drawerConfig.isOpen = true;
      fixture.detectChanges();
    });

    it('should close drawer', () => {
      const drawer: DrawerComponent = debugElement.query(drawerPredicate).componentInstance;
      drawer.apply.emit();

      expect(component.drawerConfig.isOpen).toBeFalsy();
    });

    it('should set the parameters to the main store', () => {
      spyOn(navigator, 'navigate');
      const drawer: DrawerComponent = debugElement.query(drawerPredicate).componentInstance;
      drawer.apply.emit();

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('when drawer value changes', () => {
    const newValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }];
    beforeEach(() => {
      component.drawerConfig.isOpen = true;
      fixture.detectChanges();
    });
    it('should upsert drawer store values', () => {
      spyOn(drawerStore, 'upsertParameters');

      component.drawerChange(newValues);

      expect(drawerStore.upsertParameters).toHaveBeenCalledTimes(1);
      expect(drawerStore.upsertParameters).toHaveBeenCalledWith(newValues);
    });
  });

  describe('when bubble value changes', () => {
    const newValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }];
    it('should upsert bubble store values', () => {
      spyOn(navigator, 'navigate');

      component.bubbleChange(newValues);

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith(newValues, FILTERS_SOURCE.QUICK_FILTERS, true);
    });
  });

  describe('when filter bubble open state changes', () => {
    describe('and drawer was open', () => {
      beforeEach(() => {
        component.drawerConfig.isOpen = true;
      });
      it('should close drawer', () => {
        spyOn(component, 'closeDrawer');

        component.bubbleOpenStateChange(true);

        expect(component.closeDrawer).toHaveBeenCalledTimes(1);
      });

      describe('and the filter is closed', () => {
        it('should notify that the filter content is closed', () => {
          spyOn(component.filterOpened, 'emit');

          component.bubbleOpenStateChange(false);

          expect(component.filterOpened.emit).toHaveBeenCalledWith(false);
        });
      });

      describe('and the filter is opened', () => {
        it('should notify that the filter content is opened', () => {
          spyOn(component.filterOpened, 'emit');

          component.bubbleOpenStateChange(true);

          expect(component.filterOpened.emit).toHaveBeenCalledWith(true);
        });
      });
    });
  });

  describe('when drawer open state changes', () => {
    it('should emit open state change event with the same value', () => {
      let value = false;
      component.isDrawerContentScrollable$.subscribe((val) => (value = val));

      component.drawerOpenStateChange(true);

      expect(value).toBeTruthy();
    });
  });

  describe('when drawer store values change', () => {
    const newValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }];
    it('should update drawer values', () => {
      let parameters = [];

      component.drawerValues$.subscribe((params) => (parameters = params));
      drawerStore.setParameters(newValues);

      expect(parameters).toEqual(newValues);
    });
  });

  describe('when bubble store values change', () => {
    const oldValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }];
    const newValues: FilterParameter[] = [
      { key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' },
      { key: FILTER_QUERY_PARAM_KEY.postedAgo, value: 'lastWeek' },
    ];

    beforeEach(() => {
      bubbleStore.setParameters(oldValues);
      drawerStore.setParameters(oldValues);
    });

    it('should update bubble values', () => {
      let parameters = [];

      component.drawerValues$.subscribe((params) => (parameters = params));
      bubbleStore.setParameters(newValues);

      expect(parameters).toEqual(newValues);
    });

    it('should update drawer store values', () => {
      spyOn(drawerStore, 'setParameters');

      bubbleStore.setParameters(newValues);

      expect(drawerStore.setParameters).toHaveBeenCalledTimes(1);
      expect(drawerStore.setParameters).toHaveBeenCalledWith(newValues);
    });
  });

  describe('on initialization', () => {
    const newValues: FilterParameter[] = [
      { key: FILTER_QUERY_PARAM_KEY.categoryId, value: '100' },
      { key: FILTER_QUERY_PARAM_KEY.postedAgo, value: 'lastWeek' },
    ];

    it('should not clean values', () => {
      bubbleStore.setParameters(newValues);

      expect(bubbleStore.getParameters()).toEqual(newValues);
    });
  });

  describe('when configuration change happens', () => {
    const oldValues: FilterParameter[] = [
      { key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' },
      { key: FILTER_QUERY_PARAM_KEY.postedAgo, value: 'lastWeek' },
    ];
    const newValues: FilterParameter[] = [
      { key: FILTER_QUERY_PARAM_KEY.categoryId, value: '100' },
      { key: FILTER_QUERY_PARAM_KEY.postedAgo, value: 'lastWeek' },
    ];
    const cleanValues: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '100' }];

    beforeEach(() => {
      bubbleStore.setParameters([]);
      drawerStore.setParameters([]);
    });

    describe('... in the drawer', () => {
      beforeEach(() => {
        drawerStore.setParameters(oldValues);
      });

      it('should set clean parameters', () => {
        drawerStore.setParameters(newValues);

        expect(drawerStore.getParameters()).toEqual(cleanValues);
      });

      describe('and cleanup exception present', () => {
        const locationValues = [
          { key: FILTER_QUERY_PARAM_KEY.longitude, value: '0' },
          { key: FILTER_QUERY_PARAM_KEY.latitude, value: '0' },
        ];
        const oldValuesWithLocation = [...oldValues, ...locationValues];
        const newValuesWithLocation = [...newValues, ...locationValues];
        const cleanValuesWithLocation = [...cleanValues, ...locationValues];

        beforeEach(() => {
          drawerStore.setParameters(oldValuesWithLocation);
        });
        it('should not clean exceptions', () => {
          drawerStore.setParameters(newValuesWithLocation);

          expect(drawerStore.getParameters()).toEqual(cleanValuesWithLocation);
        });
      });
    });
  });
});
