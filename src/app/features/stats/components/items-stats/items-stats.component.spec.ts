import { MOCK_ITEM } from './../../../../../tests/item.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemsStatsComponent } from './items-stats.component';
import { Subject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheapestProducts } from 'app/core/item/item-response.interface';
import { ItemService } from 'app/core/item/item.service';

describe('ItemsStatsComponent', () => {
  let component: ItemsStatsComponent;
  let fixture: ComponentFixture<ItemsStatsComponent>;
  let itemService: ItemService;
  const PRICES: CheapestProducts = { 1: '3.19', 2: '3.19' };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        declarations: [ItemsStatsComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              mine() {
                return of({ data: [MOCK_ITEM, MOCK_ITEM], init: 20 });
              },
              getCheapestProductPrice() {
                return of(PRICES);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStatsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    component.paginate = new Subject<boolean>();
  });

  describe('ngOnInit', () => {
    it('should get items and set them', () => {
      spyOn(itemService, 'mine').and.callThrough();

      fixture.detectChanges();

      expect(itemService.mine).toHaveBeenCalledWith(0, 'published');
      expect(component['init']).toBe(20);
      expect(component.items).toEqual([MOCK_ITEM, MOCK_ITEM]);
    });

    it('should call getCheapestProductPrice and set it', () => {
      spyOn(itemService, 'getCheapestProductPrice').and.callThrough();

      fixture.detectChanges();

      expect(itemService.getCheapestProductPrice).toHaveBeenCalledWith([
        '9jd7ryx5odjk',
        '9jd7ryx5odjk',
      ]);
      expect(component.prices).toEqual(PRICES);
    });
  });

  describe('onOpen', () => {
    beforeEach(() => {
      component.items = [MOCK_ITEM, MOCK_ITEM];
    });

    it('should close everything except first', () => {
      component.onOpen(0);

      expect(component.opens[0]).toBe(true);
      expect(component.opens[1]).toBe(false);
    });

    it('should close everything except second', () => {
      component.onOpen(1);

      expect(component.opens[0]).toBe(false);
      expect(component.opens[1]).toBe(true);
    });
  });
});
