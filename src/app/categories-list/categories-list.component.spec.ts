import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoriesListComponent } from './categories-list.component';
import { CategoryService } from "../core/category/category.service";
import { Observable } from "rxjs/Observable";
import { TEST_HTTP_PROVIDERS } from "shield";
import { EventService } from "../core/event/event.service";
import { CATEGORY_DATA_WEB } from "../../tests/category.fixtures";

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesListComponent ],
      providers: [
        {provide: CategoryService, useValue: {
        getCategories: () => {
          return Observable.of([{}]);
        }
        }},
        EventService,
        ...TEST_HTTP_PROVIDERS],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    eventService = TestBed.get(EventService);
  });

  describe('ngOnInit', (): void => {
    beforeEach(() => {
      spyOn(component, 'getCategories');
    });
    it('should call getCategories', (): void => {
      component.ngOnInit();
      expect(component.getCategories).toHaveBeenCalled();
    });
  });

  it('should listen to UPDATE_CATEGORY', () => {
    component.ngOnInit();
    eventService.emit(EventService.UPDATE_CATEGORY);
  });

  describe('select category', () => {
    it('should select the clicked category', () => {
      component.selectCategory(CATEGORY_DATA_WEB[0]);
      expect(component.selectedCategory.categoryId).toEqual(CATEGORY_DATA_WEB[0].categoryId);
    });
  });

  describe('get categories', () => {
    beforeEach(() => {
      component.categories = CATEGORY_DATA_WEB;
      component.getCategories();
    });
    it('should get the categories list', () => {
      expect(component.categories).toEqual(CATEGORY_DATA_WEB);
    });
  });
});
