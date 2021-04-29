import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemCardWidePlaceholderComponent } from '@public/shared/components/item-card-wide/components/item-card-wide-placeholder/item-card-wide-placeholder.component';
import { ItemCardPlaceholderComponent } from '@public/shared/components/item-card/components/item-card-placeholder/item-card-placeholder.component';
import { CARD_TYPES } from '../../enums/card-types.enum';

import { ItemCardListPlaceholderComponent } from './item-card-list-placeholder.component';

describe('ItemCardListPlaceholderComponent', () => {
  let component: ItemCardListPlaceholderComponent;
  let fixture: ComponentFixture<ItemCardListPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListPlaceholderComponent, ItemCardPlaceholderComponent, ItemCardWidePlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('on component initialization', () => {
    it('should show 15 card placeholders', () => {
      const placeholderElements = fixture.debugElement.queryAll(By.css('tsl-item-card-placeholder'));

      expect(placeholderElements.length).toEqual(component.numberOfCards);
    });

    it('should show the placeholder for regular cards', () => {
      const regularCardsPlaceholder = fixture.debugElement.query(By.css('tsl-item-card-placeholder'));
      const wideCardsPlaceholder = fixture.debugElement.query(By.css('tsl-item-card-wide-placeholder'));

      expect(regularCardsPlaceholder).toBeTruthy();
      expect(wideCardsPlaceholder).toBeFalsy();
    });

    describe('if a different number of cards is specified', () => {
      it('should show the specified number of cards', () => {
        const NUMBER_OF_CARDS = 10;
        component.numberOfCards = NUMBER_OF_CARDS;

        fixture.detectChanges();
        const placeholderElements = fixture.debugElement.queryAll(By.css('tsl-item-card-placeholder'));

        expect(placeholderElements.length).toEqual(NUMBER_OF_CARDS);
      });
    });

    describe('if a different type of card is specified', () => {
      it('should show the specified type of card', () => {
        component.cardType = CARD_TYPES.WIDE;

        fixture.detectChanges();
        const regularCardsPlaceholder = fixture.debugElement.query(By.css('tsl-item-card-placeholder'));
        const wideCardsPlaceholder = fixture.debugElement.query(By.css('tsl-item-card-wide-placeholder'));

        expect(wideCardsPlaceholder).toBeTruthy();
        expect(regularCardsPlaceholder).toBeFalsy();
      });
    });
  });
});
