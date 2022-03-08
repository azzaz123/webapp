import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { CategoryCardsComponent } from './category-cards.component';

describe('CategoryCardsComponent', () => {
  let component: CategoryCardsComponent;
  let fixture: ComponentFixture<CategoryCardsComponent>;

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
              getCategoryWithPresentationById() {},
            },
          },
          {
            provide: FILTER_PARAMETER_STORE_TOKEN,
            useValue: {
              getParameters: () => [],
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
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
