import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { InboxUser } from '@private/features/chat/core/model';
import { LATEST_ITEM_COUNT, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS, USER_ID, USER_INFO_RESPONSE } from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';
import { InboxItemForSellComponent } from './inbox-item-for-sell.component';

describe('InboxItemForSellComponent', () => {
  let component: InboxItemForSellComponent;
  let fixture: ComponentFixture<InboxItemForSellComponent>;
  let itemService: ItemService;
  let userService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [InboxItemForSellComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              getLatest() {},
            },
          },
          {
            provide: UserService,
            useValue: {
              getInfo() {
                return of(USER_INFO_RESPONSE);
              },
              getUserStats() {
                return of(MOCK_USER_STATS);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxItemForSellComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    userService = TestBed.inject(UserService);
    component.user = { id: USER_ID } as InboxUser;
    spyOn(itemService, 'getLatest').and.returnValue(
      of({
        data: MOCK_ITEM,
        count: LATEST_ITEM_COUNT,
      })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the latest selling item', () => {
    component.user.sellingItem = null;

    component.ngOnChanges({
      user: new SimpleChange(null, MOCK_USER, false),
    });

    expect(itemService.getLatest).toHaveBeenCalledWith(USER_ID);
    expect(component.user.sellingItem).toBe(MOCK_ITEM);
    expect(component.user.sellingItemCount).toBe(LATEST_ITEM_COUNT);
  });

  it('should not get the item if already loaded', () => {
    component.user.sellingItem = MOCK_ITEM;

    component.ngOnChanges({
      user: new SimpleChange(null, MOCK_USER, false),
    });

    expect(itemService.getLatest).not.toHaveBeenCalled();
  });
});
