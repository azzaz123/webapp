/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemService } from '../../core/item/item.service';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { LATEST_ITEM_COUNT, MOCK_ITEM } from '../../../tests/item.fixtures.spec';

describe('Component: UserCard', () => {

  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
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
    fixture = TestBed.createComponent(UserCardComponent);
    component = TestBed.createComponent(UserCardComponent).componentInstance;
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
