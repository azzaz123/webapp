/* tslint:disable:no-unused-variable */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER, USER_ID, MOCK_ITEM, LATEST_ITEM_COUNT, ItemService } from 'shield';
import { Observable } from 'rxjs/Observable';

describe('Component: User', () => {

  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        {
          provide: ItemService, useValue: {
          getLatest() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UserComponent);
    component = TestBed.createComponent(UserComponent).componentInstance;
    itemService = TestBed.get(ItemService);
    component.user = MOCK_USER;
    spyOn(itemService, 'getLatest').and.returnValue(Observable.of({
      data: MOCK_ITEM,
      count: LATEST_ITEM_COUNT
    }));
  });

  it('should get the latest selling item', () => {
    component.ngOnChanges();
    expect(itemService.getLatest).toHaveBeenCalledWith(USER_ID);
    expect(component.user.sellingItem).toBe(MOCK_ITEM);
    expect(component.user.itemsCount).toBe(LATEST_ITEM_COUNT);
  });

  it('should not get the item if already loaded', () => {
    component.user.sellingItem = MOCK_ITEM;
    component.ngOnChanges();
    expect(itemService.getLatest).not.toHaveBeenCalled();
  });
});
