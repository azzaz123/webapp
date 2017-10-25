import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createItemsArray } from 'shield';
import { SelectedItemsComponent } from './selected-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectedItemsComponent', () => {
  let component: SelectedItemsComponent;
  let fixture: ComponentFixture<SelectedItemsComponent>;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedItemsComponent],
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems: [],
          selectedAction: null
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set selectedItems with items', () => {
      const ITEMS = createItemsArray(5);
      component.items = ITEMS;
      itemService.selectedItems = ['1', '2'];
      component.ngOnChanges();
      expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
    });
  });
});
