/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService, MOCK_USER } from 'shield';

describe('Component: User', () => {

  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UserComponent);
    component = TestBed.createComponent(UserComponent).componentInstance;
    itemService = TestBed.get(ItemService);
    component.user = MOCK_USER;
  });
});
