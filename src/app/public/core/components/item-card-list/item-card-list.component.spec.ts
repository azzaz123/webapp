import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemCardModule } from '../item-card/item-card.module';
import { ItemCardListComponent } from './item-card-list.component';

describe('ItemCardListComponent', () => {
  let component: ItemCardListComponent;
  let fixture: ComponentFixture<ItemCardListComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListComponent],
      imports: [CommonModule, ItemCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.items = [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM];
    fixture.detectChanges();
  });

  describe('when component inits', () => {
    const cardSelector = 'tsl-public-item-card';

    it('should show as many cards as given', () => {
      expect(el.querySelectorAll(cardSelector).length).toEqual(
        component.items.length
      );
    });
  });
});
