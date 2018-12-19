import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardCallsComponent } from './user-card-calls.component';
import { ItemService } from '../../core/item/item.service';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs';
import { USER_INFO_RESPONSE, USERS_STATS_RESPONSE,
  MOCK_USER, USER_ID, SCORING_STARS, USER_REPORTS_RECEIVED } from '../../../tests/user.fixtures.spec';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';

describe('UserCardCallsComponent', () => {
  let component: UserCardCallsComponent;
  let fixture: ComponentFixture<UserCardCallsComponent>;
  let itemService: ItemService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCardCallsComponent ],
      providers: [
        {
          provide: ItemService, useValue: {
            getLatest() {}
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UserCardCallsComponent);
    component = TestBed.createComponent(UserCardCallsComponent).componentInstance;
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    component.user = MOCK_USER;
  }));

  describe('ngOnChanges', () => {

    beforeEach(() => {
      spyOn(itemService, 'getLatest').and.returnValue(Observable.of({
        data: MOCK_ITEM
      }));
      spyOn(userService, 'getInfo').and.callThrough();
      spyOn(userService, 'getUserStats').and.callThrough();
    });

    describe('itemService.getLatests', () => {
      it('should get the latest selling item', () => {
        component.user.sellingItem = undefined;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(itemService.getLatest).toHaveBeenCalledWith(USER_ID);
        expect(component.user.sellingItem).toBe(MOCK_ITEM);
      });

      it('should not get the item if already loaded', () => {
        component.user.sellingItem = MOCK_ITEM;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(itemService.getLatest).not.toHaveBeenCalled();
      });
    });

    describe('userService.getInfo', () => {
      it('should call getInfo and set user info', () => {
        component.user.scoringStars = undefined;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(userService.getInfo).toHaveBeenCalledWith(USER_ID);
        expect(component.user.scoringStars).toBe(SCORING_STARS);
      });

      it('should not call getInfo if already loaded', () => {
        component.user.scoringStars = SCORING_STARS;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(userService.getInfo).not.toHaveBeenCalled();
      });
    });

    describe('userService.getUserStats', () => {
      it('should call getUserStats and set receivedReports', () => {
        component.user.receivedReports = undefined;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(userService.getUserStats).toHaveBeenCalledWith(USER_ID);
        expect(component.user.receivedReports).toBe(USER_REPORTS_RECEIVED);
      });

      it('should not call getUserStats if already loaded', () => {
        component.user.receivedReports = USER_REPORTS_RECEIVED;

        component.ngOnChanges({
          user: new SimpleChange(null, MOCK_USER, false)
        });

        expect(userService.getUserStats).not.toHaveBeenCalled();
      });
    });
  });
});
