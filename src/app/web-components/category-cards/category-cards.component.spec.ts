import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { categoriesWithPresentationFixture } from '@api/fixtures/categories/categories.fixtures';
import { CategoryWithPresentation } from '@core/category/category-with-presentation.interface';
import { AccessTokenService } from '@core/http/access-token.service';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Observable, of } from 'rxjs';
import { CategoryCardsComponent } from './category-cards.component';

describe('CategoryCardsComponent', () => {
  let component: CategoryCardsComponent;
  let fixture: ComponentFixture<CategoryCardsComponent>;
  let searchNavigatorService: SearchNavigatorService;
  const categoryCardsTitleSelector = '.CategoryCards__title';
  let filterParameters = [];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, RouterTestingModule],
        declarations: [CategoryCardsComponent],
        providers: [
          {
            provide: AccessTokenService,
            useValue: {
              accessToken: 'T',
            },
          },
          {
            provide: SearchNavigatorService,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: CategoriesApiService,
            useValue: {
              getCategoryWithPresentationById(id: string): Observable<CategoryWithPresentation> {
                return of(+id === 0 ? categoriesWithPresentationFixture[0] : categoriesWithPresentationFixture[1]);
              },
            },
          },
          {
            provide: FILTER_PARAMETER_STORE_TOKEN,
            useValue: {
              getParameters: () => filterParameters,
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCardsComponent);
    component = fixture.componentInstance;
    searchNavigatorService = TestBed.inject(SearchNavigatorService);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('on category or object type changes', () => {
    describe('when no category or object type are defined', () => {
      beforeEach(() => {
        component.categoryId = null;
        component.objectTypeId = null;
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('title must be empty', () => {
        expect(fixture.debugElement.query(By.css(categoryCardsTitleSelector)).nativeElement.innerHTML).toBe('');
      });
    });

    describe('when category is defined but not object type ', () => {
      beforeEach(() => {
        component.categoryId = '0';
        component.objectTypeId = null;
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('title must be the category one', () => {
        expect(fixture.debugElement.query(By.css(categoryCardsTitleSelector)).nativeElement.innerHTML).toBe(
          categoriesWithPresentationFixture[0].name
        );
      });
    });

    describe('when object type is defined but not the category ', () => {
      beforeEach(() => {
        component.categoryId = null;
        component.objectTypeId = '1';
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('title must be the category one', () => {
        expect(fixture.debugElement.query(By.css(categoryCardsTitleSelector)).nativeElement.innerHTML).toBe(
          categoriesWithPresentationFixture[1].name
        );
      });
    });

    describe('when category and object type are defined ', () => {
      beforeEach(() => {
        component.categoryId = '0';
        component.objectTypeId = '1';
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('title must be the object type one', () => {
        expect(fixture.debugElement.query(By.css(categoryCardsTitleSelector)).nativeElement.innerHTML).toBe(
          categoriesWithPresentationFixture[1].name
        );
      });
    });
  });

  describe('on card click', () => {
    const customEvent: CustomEvent = new CustomEvent('cardClick', { detail: { id: 'id' } });

    beforeEach(() => {
      spyOn(searchNavigatorService, 'navigate');
    });

    describe('when no category or object type are defined', () => {
      beforeEach(() => {
        component.categoryId = null;
        component.objectTypeId = null;
        component.cardClick(customEvent);
      });

      it('searchNavigatorService should have been called with current params + category', () => {
        const expectedParams: FilterParameter[] = [
          {
            key: FILTER_QUERY_PARAM_KEY.categoryId,
            value: customEvent.detail.id,
          },
        ];

        expect(searchNavigatorService.navigate).toHaveBeenCalledWith(expectedParams, FILTERS_SOURCE.SUBCATEGORY_SLIDER);
      });
    });

    describe('when category is defined but not object type ', () => {
      beforeEach(() => {
        component.categoryId = '0';
        component.objectTypeId = null;

        filterParameters = [
          {
            key: FILTER_QUERY_PARAM_KEY.categoryId,
            value: component.categoryId,
          },
        ];

        component.cardClick(customEvent);
      });

      it('searchNavigatorService should have been called with current params + object type', () => {
        const expectedParams: FilterParameter[] = [
          {
            key: FILTER_QUERY_PARAM_KEY.categoryId,
            value: component.categoryId,
          },
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: customEvent.detail.id,
          },
        ];

        expect(searchNavigatorService.navigate).toHaveBeenCalledWith(expectedParams, FILTERS_SOURCE.SUBCATEGORY_SLIDER);
      });
    });

    describe('when object type is defined but not the category ', () => {
      beforeEach(() => {
        component.categoryId = null;
        component.objectTypeId = '1';

        filterParameters = [
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: customEvent.detail.id,
          },
        ];

        component.cardClick(customEvent);
      });

      it('searchNavigatorService should have been called updated current params', () => {
        const expectedParams: FilterParameter[] = [
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: customEvent.detail.id,
          },
        ];

        expect(searchNavigatorService.navigate).toHaveBeenCalledWith(expectedParams, FILTERS_SOURCE.SUBCATEGORY_SLIDER);
      });
    });

    describe('when category and object type are defined ', () => {
      beforeEach(() => {
        component.categoryId = '0';
        component.objectTypeId = '1';

        filterParameters = [
          {
            key: FILTER_QUERY_PARAM_KEY.categoryId,
            value: component.categoryId,
          },
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: component.objectTypeId,
          },
        ];
        component.cardClick(customEvent);
      });

      it('searchNavigatorService should have been called with updated current params', () => {
        const expectedParams: FilterParameter[] = [
          {
            key: FILTER_QUERY_PARAM_KEY.categoryId,
            value: component.categoryId,
          },
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: customEvent.detail.id,
          },
        ];

        expect(searchNavigatorService.navigate).toHaveBeenCalledWith(expectedParams, FILTERS_SOURCE.SUBCATEGORY_SLIDER);
      });
    });
  });
});
