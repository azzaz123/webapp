/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from '../../core/item/item.service';
import {
  MOCK_USER,
  RESPONSE_RATE,
  SCORING_STARS,
  USER_ID,
  USER_INFO_RESPONSE,
  USER_REPORTS_RECEIVED,
  USERS_STATS_RESPONSE
} from '../../../tests/user.fixtures.spec';
import { LATEST_ITEM_COUNT, MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { UserService } from '../../core/user/user.service';

describe('Component: UserCard', () => {

  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let itemService: ItemService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
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
    });
    fixture = TestBed.createComponent(UserCardComponent);
    component = TestBed.createComponent(UserCardComponent).componentInstance;
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    component.user = MOCK_USER;
    spyOn(itemService, 'getLatest').and.returnValue(Observable.of({
      data: MOCK_ITEM,
      count: LATEST_ITEM_COUNT
    }));
  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      spyOn(userService, 'getInfo').and.callThrough();
      spyOn(userService, 'getUserStats').and.callThrough();
    });

    it('should get the latest selling item', () => {
      component.user.sellingItem = undefined;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false)
      });

      expect(itemService.getLatest).toHaveBeenCalledWith(USER_ID);
      expect(component.user.sellingItem).toBe(MOCK_ITEM);
      expect(component.user.itemsCount).toBe(LATEST_ITEM_COUNT);
    });

    it('should not get the item if already loaded', () => {
      component.user.sellingItem = MOCK_ITEM;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false)
      });

      expect(itemService.getLatest).not.toHaveBeenCalled();
    });

    it('should call getInfo and set user info', () => {
      component.user.scoringStars = undefined;
      component.user.responseRate = undefined;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false)
      });

      expect(userService.getInfo).toHaveBeenCalledWith(MOCK_USER.id);
      expect(component.user.scoringStars).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });

    it('should not call getInfo when user scoringStars and responseRate property', () => {
      component.user.scoringStars = 10;
      component.user.responseRate = 'test';

      component.ngOnChanges({
        user: new SimpleChange( component.user, MOCK_USER, false)
      });

      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.scoringStars).toBe(10);
      expect(component.user.responseRate).toBe('test');
    });

    it('should not call getInfo when user is not changed', () => {
      component.ngOnChanges({});

      expect(userService.getInfo).not.toHaveBeenCalled();
    });

    it('should call getUserStats and set user receivedReports', () => {
      component.user.receivedReports = undefined;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false)
      });

      expect(userService.getUserStats).toHaveBeenCalledWith(MOCK_USER.id);
      expect(component.user.receivedReports).toBe(USER_REPORTS_RECEIVED);
    });

    it('should not call getUserStats when user has receivedReports property', () => {
      component.user.receivedReports = 10;

      component.ngOnChanges({
        user: new SimpleChange( component.user, MOCK_USER, false)
      });

      expect(userService.getUserStats).not.toHaveBeenCalled();
      expect(component.user.receivedReports).toBe(10);
    });
  });
});
