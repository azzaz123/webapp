import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RECOMMENDATIONS_ENGINE, RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommendedItemsComponent } from './recommended-items.component';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_ITEM_INDEX } from '../../core/services/item-detail-track-events/track-events.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';

describe('RecommendedItemsComponent', () => {
  const itemCardListTag = 'tsl-public-item-card-list';
  let component: RecommendedItemsComponent;
  let fixture: ComponentFixture<RecommendedItemsComponent>;
  let mockEntries = [{ isIntersecting: true }];
  const observeFn = jest.fn();
  const unobserveFn = jest.fn();
  class MockObserver {
    constructor(fn) {
      fn(mockEntries, this);
    }
    observe() {
      observeFn();
    }
    unobserve() {
      unobserveFn();
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedItemsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedItemsComponent);
    component = fixture.componentInstance;

    jest.doMock('intersection-observer-mock', () => MockObserver, { virtual: true });
    window.IntersectionObserver = jest.requireMock('intersection-observer-mock');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have recommended items...', () => {
    beforeEach(() => {
      component.recommendedItems = [MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD];
      component.recommendedType = RECOMMENDER_TYPE.MORE_LIKE_THIS;
      spyOn(component.initRecommendedItemsSlider, 'emit');

      component.ngAfterViewInit();
      fixture.detectChanges();
    });

    it('should show the item card list', () => {
      const cardList = fixture.debugElement.query(By.css(itemCardListTag));

      expect(cardList).toBeTruthy();
      expect(component.items.length).toBeLessThanOrEqual(6);
    });

    it('should emit initRecommendedItemsSlider event one time if the slider is scrolled to the view', () => {
      let mockRecommendedItemIds = component.recommendedItems.map((item: ItemCard) => item.id).toString();

      expect(component.initRecommendedItemsSlider.emit).toHaveBeenCalledWith({
        recommendedItemIds: mockRecommendedItemIds,
        engine: RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR,
      });
      expect(component.initRecommendedItemsSlider.emit).toHaveBeenCalledTimes(1);
    });

    describe('when we got more than six recommended items...', () => {
      beforeEach(() => {
        component.recommendedItems = [
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
          MOCK_ITEM_CARD,
        ];

        component.ngAfterViewInit();
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
