import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';
import { SEARCH_TECHNIQUE_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { RECOMMENDED_ITEM_MOCK } from './constants/recommended-items.fixtures.spec';
import { RecommendedItemsComponent } from './recommended-items.component';

describe('RecommendedItemsComponent', () => {
  const itemCardListTag = 'tsl-public-item-card-list';
  let component: RecommendedItemsComponent;
  let fixture: ComponentFixture<RecommendedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedItemsComponent],
      providers: [MapRecommendedItemCardService],
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
      component.recommendedItems = [
        RECOMMENDED_ITEM_MOCK,
        RECOMMENDED_ITEM_MOCK,
        RECOMMENDED_ITEM_MOCK,
        RECOMMENDED_ITEM_MOCK,
        RECOMMENDED_ITEM_MOCK,
      ];

      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show the item card list', () => {
      const cardList = fixture.debugElement.query(By.css(itemCardListTag));

      expect(cardList).toBeTruthy();
      expect(component.items.length).toBeLessThanOrEqual(6);
    });

    it('should emit initRecommendedItemsSlider event', () => {
      spyOn(component.initRecommendedItemsSlider, 'emit');
      component.ngOnChanges();
      const recommendedItemIds: string = component.items.map((item: ItemCard) => item.id).toString();
      fixture.detectChanges();

      expect(component.initRecommendedItemsSlider.emit).toHaveBeenCalledWith({
        recommendedItemIds: recommendedItemIds,
        engine: SEARCH_TECHNIQUE_ENGINE.MORE_LIKE_THIS_SOLR,
      });
    });

    describe('when we got more than six recommended items...', () => {
      beforeEach(() => {
        component.recommendedItems = [
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

        component.ngOnChanges();
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
