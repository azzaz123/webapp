import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SuggesterComponent } from './suggester.component';
import { SUGGESTER_DATA_WEB } from '@fixtures/suggester.fixtures.spec';
import { EventService } from '@core/event/event.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '@core/category/category.service';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';

const MOCK_SEARCH_KEYWORD: SearchBoxValue = { [FILTER_QUERY_PARAM_KEY.keywords]: 'iphone' };
const MOCK_SUGGESTER_RESPONSE = SUGGESTER_DATA_WEB[0];
const MOCK_CATEGORY = CATEGORY_DATA_WEB[1];

const searchParamsMockSubject = new BehaviorSubject(MOCK_SEARCH_KEYWORD);
const searchParamsMock = searchParamsMockSubject.asObservable();

describe('SuggesterComponent', () => {
  let component: SuggesterComponent;
  let fixture: ComponentFixture<SuggesterComponent>;
  let suggesterService: SuggesterService;
  let eventService: EventService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule],
        declarations: [SuggesterComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: SuggesterService,
            useValue: {
              getSuggestions: () => {
                return of(SUGGESTER_DATA_WEB);
              },
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: searchParamsMock,
            },
          },
          {
            provide: CategoryService,
            useValue: {
              getCategoryById() {
                return of(CATEGORY_DATA_WEB[1]);
              },
            },
          },
          EventService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    suggesterService = TestBed.inject(SuggesterService);
    fixture.detectChanges();
  });

  describe('when the component is initialized', () => {
    describe('and a keyword is already defined in the URL query params', () => {
      it('should show the keyword in the search box', () => {
        expect(component.searchBoxValue).toEqual(MOCK_SEARCH_KEYWORD);
      });

      it('should show the active state for the search box', () => {
        const searchBox = fixture.debugElement.query(By.css('.SearchBox')).nativeElement;

        expect(searchBox.classList).toContain('SearchBox--active');
      });
    });
  });

  describe('when setting a new search value', () => {
    it('should get suggestions', () => {
      spyOn(suggesterService, 'getSuggestions').and.callThrough();

      component.suggest(of('ps4')).subscribe();

      expect(suggesterService.getSuggestions).toHaveBeenCalledWith('ps4');
    });

    describe('and pressing the return key', () => {
      describe('if any suggestion is selected', () => {
        it('should apply the search with the selected keyword', () => {
          const inputElement = fixture.debugElement.query(By.css('.SearchBox__input'));
          spyOn(component.searchSubmit, 'emit');

          inputElement.nativeElement.value = 'samsung';
          inputElement.nativeElement.dispatchEvent(new Event('input'));
          inputElement.triggerEventHandler('keydown.enter', {});
          fixture.detectChanges();

          expect(component.searchBoxValue).toEqual({ [FILTER_QUERY_PARAM_KEY.keywords]: 'samsung' });
          expect(component.searchSubmit.emit).toHaveBeenCalledWith({ [FILTER_QUERY_PARAM_KEY.keywords]: 'samsung' });
        });
      });

      describe('if a suggestion is selected', () => {
        it('should apply the search with the selected suggestion', () => {
          const inputElement = fixture.debugElement.query(By.css('.SearchBox__input'));
          spyOn(component.searchSubmit, 'emit');

          component.searchBoxValueChange(MOCK_SUGGESTER_RESPONSE);
          inputElement.triggerEventHandler('keydown.enter', {});
          fixture.detectChanges();

          expect(component.searchBoxValue).toEqual({
            [FILTER_QUERY_PARAM_KEY.keywords]: MOCK_SUGGESTER_RESPONSE.suggestion,
            [FILTER_QUERY_PARAM_KEY.categoryId]: `${MOCK_SUGGESTER_RESPONSE.category_id}`,
          });
          expect(component.searchSubmit.emit).toHaveBeenCalledWith({
            [FILTER_QUERY_PARAM_KEY.keywords]: MOCK_SUGGESTER_RESPONSE.suggestion,
            [FILTER_QUERY_PARAM_KEY.categoryId]: `${MOCK_SUGGESTER_RESPONSE.category_id}`,
          });
        });
      });
    });

    describe('and clicking on the suggestion', () => {
      it('should apply the search with the selected suggestion', () => {
        spyOn(component.searchSubmit, 'emit');

        component.suggestionClick(MOCK_SUGGESTER_RESPONSE);

        expect(component.searchSubmit.emit).toHaveBeenCalledWith({
          [FILTER_QUERY_PARAM_KEY.keywords]: MOCK_SUGGESTER_RESPONSE.suggestion,
          [FILTER_QUERY_PARAM_KEY.categoryId]: `${MOCK_SUGGESTER_RESPONSE.category_id}`,
        });
      });
    });
  });

  describe('when clicking the reset button', () => {
    it('should reset the current kewyord value', () => {
      const resetElement = fixture.debugElement.query(By.css('.SearchBox__reset'));

      resetElement.triggerEventHandler('click', {});

      expect(component.searchBoxValue).toEqual({ [FILTER_QUERY_PARAM_KEY.keywords]: '' });
    });

    it('should emit cancel with previous search value', () => {
      const resetElement = fixture.debugElement.query(By.css('.SearchBox__reset'));
      const previousSearchBoxValue = component.searchBoxValue;
      spyOn(component.searchCancel, 'emit');

      resetElement.triggerEventHandler('click', {});

      expect(component.searchCancel.emit).toHaveBeenCalledWith(previousSearchBoxValue);
    });
  });

  describe('when the search has a category selected', () => {
    it('should show the category name as the placeholder for the input', () => {
      searchParamsMockSubject.next({
        ...MOCK_SEARCH_KEYWORD,
        [FILTER_QUERY_PARAM_KEY.categoryId]: `${MOCK_CATEGORY.category_id}`,
      });

      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('.SearchBox__input')).nativeElement;

      expect(inputElement.placeholder).toBe(`Search in ${MOCK_CATEGORY.name}`);
    });
  });
});
