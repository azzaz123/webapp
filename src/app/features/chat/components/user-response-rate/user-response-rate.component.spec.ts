import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { UserResponseRateComponent } from './user-response-rate.component';

describe('UserResponseRateComponent', () => {
  let component: UserResponseRateComponent;
  let fixture: ComponentFixture<UserResponseRateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserResponseRateComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

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
