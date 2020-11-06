import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectorComponent } from './category-selector.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

describe('CategorySelectorComponent', () => {
  let component: CategorySelectorComponent;
  let fixture: ComponentFixture<CategorySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbPopoverConfig],
      declarations: [CategorySelectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('setCategory', () => {
    it('should emit category', () => {
      let category: string;
      component.onSelect.subscribe((cat: string) => {
        category = cat;
      });

      component.setCategory(123);

      expect(category).toBe('123');
    });
  });
});
