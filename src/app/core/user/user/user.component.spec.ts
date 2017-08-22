/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER, USER_ID } from 'shield';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import { RESPONSE_RATE, SCORING_STARS, USER_INFO_RESPONSE } from '../../../../tests/user.fixtures';

describe('Component: User', () => {

  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        {
          provide: UserService, useValue: {
          getInfo() {
            return Observable.of(USER_INFO_RESPONSE)
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UserComponent);
    component = TestBed.createComponent(UserComponent).componentInstance;
    userService = TestBed.get(UserService);
    component.user = MOCK_USER;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(userService, 'getInfo').and.callThrough();
    });
    it('should call getInfo and set user info', () => {
      component.user.scoringStars = undefined;
      component.user.responseRate = undefined;
      component.ngOnChanges();
      expect(userService.getInfo).toHaveBeenCalledWith(USER_ID);
      expect(component.user.scoringStars).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });
    it('should call getInfo and set user info', () => {
      component.user.scoringStars = 10;
      component.user.responseRate = 'test';
      component.ngOnChanges();
      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.scoringStars).toBe(10);
      expect(component.user.responseRate).toBe('test');
    });
  });
});
