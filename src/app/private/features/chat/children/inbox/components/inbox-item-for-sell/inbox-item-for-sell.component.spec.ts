import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { InboxUser } from '@private/features/chat/core/model';
import { LATEST_ITEM_COUNT, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS, USER_ID, USER_INFO_RESPONSE } from '@fixtures/user.fixtures.spec';
import { of, BehaviorSubject } from 'rxjs';
import { InboxItemForSellComponent } from './inbox-item-for-sell.component';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { Router } from '@angular/router';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';

describe('InboxItemForSellComponent', () => {
  let component: InboxItemForSellComponent;
  let fixture: ComponentFixture<InboxItemForSellComponent>;
  let itemService: ItemService;
  let userService: UserService;
  let router: Router;

  const standaloneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CoreModule, SharedModule],
        declarations: [InboxItemForSellComponent],
        providers: [
          {
            provide: StandaloneService,
            useValue: {
              standalone$: standaloneSubject.asObservable(),
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: ItemService,
            useValue: {
              getLatest() {},
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
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
    router = TestBed.inject(Router);
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

  describe('when a click is triggered on an item for sell card', () => {
    beforeEach(() => {
      component.user.sellingItem = MOCK_ITEM;
    });
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(true);
        fixture.detectChanges();
        spyOn(router, 'navigate');
      });
      it('should navigate to the favorite item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.id}`;
        const itemForSellCard = fixture.debugElement.query(By.css('.card')).nativeElement;

        itemForSellCard.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
    describe('and the app is NOT on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(false);
        fixture.detectChanges();
        spyOn(window, 'open');
      });
      it('should navigate to the favorite item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.webSlug}`;
        const itemForSellCard = fixture.debugElement.query(By.css('.card')).nativeElement;

        itemForSellCard.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});
