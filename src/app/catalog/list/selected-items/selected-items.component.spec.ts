import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedItemsComponent } from './selected-items.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { createItemsArray } from '../../../../tests/item.fixtures.spec';

describe('SelectedItemsComponent', () => {
  let component: SelectedItemsComponent;
  let fixture: ComponentFixture<SelectedItemsComponent>;
  let itemService: ItemService;
  const anId = '1';
  const anotherId = '2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedItemsComponent],
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems$: new ReplaySubject(1),
          selectedItems: [],
          selectedAction: null
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
  });

  describe('ngOnInit', () => {
    it('should set selectedItems with items', () => {
      itemService.selectedAction = 'feature';
      const ITEMS = createItemsArray(5);
      component.items = ITEMS;
      itemService.selectedItems = [anId, anotherId];
      fixture.detectChanges();

      itemService.selectedItems$.next({
        id: anId,
        action: 'selected'
      });

      expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
    });
  });

});
