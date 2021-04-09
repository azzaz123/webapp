import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_ITEM_INDEX } from '../../core/services/item-detail-track-events/track-events.fixtures.spec';
import { RECOMMENDED_ITEM_MOCK } from './constants/recommended-items.fixtures.spec';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { RecommendedItemsComponent } from './recommended-items.component';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';

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

      it('should emit the event if we click on one of the recommended item cards', () => {
        const itemCard: DebugElement = fixture.debugElement.query(By.css(itemCardListTag));
        spyOn(component.clickedItemAndIndexEvent, 'emit');

        itemCard.triggerEventHandler('clickedItemAndIndex', { itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
        fixture.detectChanges();

        expect(component.clickedItemAndIndexEvent.emit).toHaveBeenCalledWith({ itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
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
