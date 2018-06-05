import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoriesListComponent } from './categories-list.component';
import { CategoryService } from '../../../core/category/category.service';
import { Observable } from 'rxjs/Observable';
import { CATEGORY_DATA_WEB } from '../../../../tests/category.fixtures.spec';
import { EventService } from '../../../core/event/event.service';
import { CategoryResponse } from '../../../core/category/category-response.interface';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let eventService: EventService;
  let service: CategoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesListComponent ],
      providers: [
        {provide: CategoryService, useValue: {
        getCategories: () => {
          return Observable.of(CATEGORY_DATA_WEB);
        }
        }},
        EventService,
        I18nService,
        {provide: 'SUBDOMAIN', useValue: 'www'},
        ...TEST_HTTP_PROVIDERS],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    eventService = TestBed.get(EventService);
    service = TestBed.get(CategoryService);
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

  describe('select category', () => {
    it('should select the clicked category', () => {
      spyOn(eventService, 'subscribe').and.callThrough();
      spyOn(component.newCategory, 'emit');
      component.selectCategory(CATEGORY_DATA_WEB[0]);
      expect(component.selectedCategory.categoryId).toEqual(CATEGORY_DATA_WEB[0].categoryId);
      expect(component.newCategory.emit).toHaveBeenCalledWith(CATEGORY_DATA_WEB[0]);
    });
  });

  describe('get categories', () => {
    const CATEGORIES: CategoryResponse[] = CATEGORY_DATA_WEB;
    it('should get the categories list', () => {
      spyOn(service, 'getCategories').and.callThrough();
      component.getCategories();
      expect(component.categories).toEqual(CATEGORIES);
    });
  });
});
