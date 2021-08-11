import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategorySelectorComponent } from './category-selector.component';

describe('CategorySelectorComponent', () => {
  let component: CategorySelectorComponent;
  let fixture: ComponentFixture<CategorySelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [NgbPopoverConfig],
        declarations: [CategorySelectorComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('setCategory', () => {
    it('should emit category', () => {
      let category: string;
      component.selected.subscribe((cat: string) => {
        category = cat;
      });

      component.setCategory(123);

      expect(category).toBe('123');
    });
  });
});
