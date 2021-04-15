import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RECOMMENDATIONS_ENGINE, RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { MockItemdDetailTrackEventService } from '../../core/services/item-detail-track-events/track-events.fixtures.spec';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { ItemDetailTrackEventsService } from '../../core/services/item-detail-track-events/item-detail-track-events.service';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';
import { RecommendedItemsComponent } from './recommended-items.component';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_ITEM_INDEX } from '../../core/services/item-detail-track-events/track-events.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';

describe('RecommendedItemsComponent', () => {
  const itemCardListTag = 'tsl-public-item-card-list';
  let component: RecommendedItemsComponent;
  let fixture: ComponentFixture<RecommendedItemsComponent>;
  let itemDetailTrackEventsService: ItemDetailTrackEventsService;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedItemsComponent],
      providers: [
        MapRecommendedItemCardService,
        {
          provide: ItemDetailTrackEventsService,
          useClass: MockItemdDetailTrackEventService,
        },
        {
          provide: UserService,
          useClass: MockedUserService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedItemsComponent);
    component = fixture.componentInstance;
    itemDetailTrackEventsService = TestBed.inject(ItemDetailTrackEventsService);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have recommended items...', () => {
    const observeFn = jest.fn();
    let mockEntries = [{ isIntersecting: true }];
    class MockObserver {
      constructor(fn) {
        fn(mockEntries);
      }
      observe() {
        observeFn();
      }
    }
    beforeEach(() => {
      jest.doMock('intersection-observer-mock', () => MockObserver, { virtual: true });
      window.IntersectionObserver = jest.requireMock('intersection-observer-mock');
      component.recommendedItems = [MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD];
      component.recommendedType = RECOMMENDER_TYPE.MORE_LIKE_THIS;
      spyOn(component.initRecommendedItemsSlider, 'emit');
    });

    it('should show the item card list', () => {
      component.ngAfterViewInit();
      fixture.detectChanges();
      const cardList = fixture.debugElement.query(By.css(itemCardListTag));

      expect(cardList).toBeTruthy();
      expect(component.items.length).toBeLessThanOrEqual(6);
    });

    it('should emit initRecommendedItemsSlider event one time if the slider is scrolled to the view', () => {
      let mockRecommendedItemIds = component.recommendedItems.map((item: ItemCard) => item.id).toString();

      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(component.initRecommendedItemsSlider.emit).toHaveBeenCalledWith({
        recommendedItemIds: mockRecommendedItemIds,
        engine: RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR,
      });
      expect(component.initRecommendedItemsSlider.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit initRecommendedItemsSlider event if the slider is not scrolled to the view', () => {
      mockEntries = [{ isIntersecting: false }];

      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(component.initRecommendedItemsSlider.emit).not.toHaveBeenCalled();
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

      it('should send favourite or unfavourite event if we favourite or unfavourite the item card in the slider', () => {
        const itemCard: DebugElement = fixture.debugElement.query(By.css(itemCardListTag));
        spyOn(itemDetailTrackEventsService, 'trackFavouriteOrUnfavouriteEvent');
        spyOn(userService, 'get').and.returnValue(of(MOCK_USER));

        itemCard.triggerEventHandler('toggleFavouriteEvent', MOCK_ITEM_CARD);
        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD, MOCK_USER?.featured);
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
