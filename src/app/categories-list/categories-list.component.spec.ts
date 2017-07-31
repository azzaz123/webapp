import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoriesListComponent } from './categories-list.component';
import { CategoryService } from "../core/category/category.service";
import { Observable } from "rxjs/Observable";
import { TEST_HTTP_PROVIDERS } from "shield";

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesListComponent ],
      providers: [{provide: CategoryService, useValue: {
        getCategories: () => {
          return Observable.of([{}]);
        }
      }}, ...TEST_HTTP_PROVIDERS],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
