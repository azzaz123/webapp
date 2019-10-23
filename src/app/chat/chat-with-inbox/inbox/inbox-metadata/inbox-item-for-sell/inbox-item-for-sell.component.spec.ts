import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxItemForSellComponent } from './inbox-item-for-sell.component';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { MOCK_USER, USER_ID, USER_INFO_RESPONSE, USERS_STATS_RESPONSE } from '../../../../../../tests/user.fixtures.spec';
import { LATEST_ITEM_COUNT, MOCK_ITEM } from '../../../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../../../core/item/item.service';
import { UserService } from '../../../../../core/user/user.service';
import { Observable } from 'rxjs';
import { InboxUser } from '../../../../model/inbox-user';

describe('InboxItemForSellComponent', () => {
  let component: InboxItemForSellComponent;
  let fixture: ComponentFixture<InboxItemForSellComponent>;
  let itemService: ItemService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        InboxItemForSellComponent
      ],
      providers: [
        {
          provide: ItemService, useValue: {
            getLatest() {
            }
          }
        },
        {
          provide: UserService, useValue: {
            getInfo() {
              return Observable.of(USER_INFO_RESPONSE);
            },
            getUserStats() {
              return Observable.of(USERS_STATS_RESPONSE);
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxItemForSellComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    component.user = { id: USER_ID } as InboxUser;
    spyOn(itemService, 'getLatest').and.returnValue(Observable.of({
      data: MOCK_ITEM,
      count: LATEST_ITEM_COUNT
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the latest selling item', () => {
    component.user.sellingItem = null;

    component.ngOnChanges({
      user: new SimpleChange(null, MOCK_USER, false)
    });

    expect(itemService.getLatest).toHaveBeenCalledWith(USER_ID);
    expect(component.user.sellingItem).toBe(MOCK_ITEM);
    expect(component.user.sellingItemCount).toBe(LATEST_ITEM_COUNT);
  });

  it('should not get the item if already loaded', () => {
    component.user.sellingItem = MOCK_ITEM;

    component.ngOnChanges({
      user: new SimpleChange(null, MOCK_USER, false)
    });

    expect(itemService.getLatest).not.toHaveBeenCalled();
  });
});
