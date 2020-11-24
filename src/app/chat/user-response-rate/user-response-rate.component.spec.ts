import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResponseRateComponent } from './user-response-rate.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';

describe('UserResponseRateComponent', () => {
  let component: UserResponseRateComponent;
  let fixture: ComponentFixture<UserResponseRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserResponseRateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponseRateComponent);
    component = fixture.componentInstance;
    component.responseRate = MOCK_USER.responseRate;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
