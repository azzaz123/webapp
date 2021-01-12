import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { isCurrentUserPipe } from './is-current-user.pipe';

@Component({
  template: '{{userId | isCurrentUser}}',
})
class TestComponent {
  public userId: string;
}

describe('isCurrentUserPipe', () => {
  const userId = '123';
  const userId_2 = '456';
  let userService: UserService;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [isCurrentUserPipe, TestComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            user: { id: userId },
          },
        },
      ],
    });

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  describe('when user logged', () => {
    it('should return true if session user id is equal', () => {
      component.userId = userId;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('true');
    });

    it('should return false if session user id is not equal', () => {
      component.userId = userId_2;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });

  describe('when user not logged', () => {
    it('should return false', () => {
      component.userId = userId;
      (userService as any).user = undefined;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });
});
