import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { RECOMMENDED_ITEMS_MOCK, RECOMMENDED_ITEM_MOCK } from './constants/recommended-items.fixtures.spec';
import { RecommendedItemsComponent } from './recommended-items.component';

describe('RecommendedItemsComponent', () => {
  const itemCardListTag = 'tsl-public-item-card-list';
  let component: RecommendedItemsComponent;
  let fixture: ComponentFixture<RecommendedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedItemsComponent],
      providers: [MapItemService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have recommended items...', () => {
    beforeEach(() => {
      component.recommendedItems = RECOMMENDED_ITEMS_MOCK;

      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show the item card list', () => {
      const cardList = fixture.debugElement.query(By.css(itemCardListTag));

      expect(cardList).toBeTruthy();
      expect(component.items.length).toBeLessThanOrEqual(6);
    });

    describe('when we got more than six recommended items...', () => {
      beforeEach(() => {
        component.recommendedItems.recommended_items = [
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
          RECOMMENDED_ITEM_MOCK,
        ];
        fixture.detectChanges();
      });

      it('should only load the first six', () => {
        expect(component.items.length).toBe(6);
      });
    });
  });

  describe('when we NOT have recommended items...', () => {
    it('should NOT show the item card list', () => {
      const cardList = fixture.debugElement.query(By.css(itemCardListTag));

      expect(cardList).toBeFalsy();
    });
  });
});
