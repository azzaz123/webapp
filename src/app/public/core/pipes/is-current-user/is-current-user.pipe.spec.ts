import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockUser, MockUserService, OTHER_USER_ID, USER_ID } from '@fixtures/user.fixtures.spec';
import { IsCurrentUserPipe } from './is-current-user.pipe';

@Component({
  template: '{{userId | isCurrentUser}}',
})
class TestComponent {
  public userId: string;
}

describe('isCurrentUserPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [IsCurrentUserPipe, TestComponent],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService,
        },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  describe('when user logged', () => {
    it('should return true if session user id is equal', () => {
      component.userId = MockUser.id;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('true');
    });

    it('should return false if session user id is not equal', () => {
      component.userId = OTHER_USER_ID;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });

  describe('when user not logged', () => {
    it('should return false', () => {
      spyOn(userService, 'isLogged').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });
});
