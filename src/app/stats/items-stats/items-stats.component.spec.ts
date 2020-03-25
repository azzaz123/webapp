import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStatsComponent } from './items-stats.component';
import { ItemService } from '../../core/item/item.service';
import { Observable ,  Subject } from 'rxjs';
import { MomentModule } from 'angular2-moment';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { CheapestProducts } from '../../core/item/item-response.interface';

describe('ItemsStatsComponent', () => {
  let component: ItemsStatsComponent;
  let fixture: ComponentFixture<ItemsStatsComponent>;
  let itemService: ItemService;
  const PRICES: CheapestProducts = { 1: '3.19', 2: '3.19' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule],
      declarations: [ ItemsStatsComponent ],
      providers: [
        {
          provide: ItemService, useValue: {
          mine() {
            return Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: 20})
          },
          getCheapestProductPrice() {
            return Observable.of(PRICES);
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStatsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
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

      expect(itemService.getCheapestProductPrice).toHaveBeenCalledWith(['9jd7ryx5odjk', '9jd7ryx5odjk']);
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
