import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectorComponent } from './category-selector.component';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CategorySelectorComponent', () => {
  let component: CategorySelectorComponent;
  let fixture: ComponentFixture<CategorySelectorComponent>;
  let route: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySelectorComponent ],
      providers: [
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('changeCategory', () => {
    it('should call navigate', () => {
      spyOn(route, 'navigate');
      component.changeCategory('100');
      expect(route.navigate).toHaveBeenCalledWith(['/catalog/upload/100'])
    })
  });

});
