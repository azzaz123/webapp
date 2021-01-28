import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile, UserId } from '@data/user';
import { ProfileMother, UserIdMother } from '@fixtures/data/user/domain';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { IsCurrentUserPipe } from './is-current-user.pipe';

@Component({
  template: '{{userId | isCurrentUser | async}}',
})
class TestComponent {
  public userId: string;
}

describe('isCurrentUserPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let storeMock;

  beforeEach(() => {
    storeMock = {
      select: () => {},
    };
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [IsCurrentUserPipe, TestComponent],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  describe('when user logged', () => {
    it('should return true if session user id is equal', () => {
      const userId: UserId = UserIdMother.random();
      component.userId = userId;
      spyOn(storeMock, 'select').and.returnValue(of(userId));

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('true');
    });

    it('should return false if session user id is not equal', () => {
      const userStore: Profile = ProfileMother.random();
      spyOn(storeMock, 'select').and.returnValue(of(userStore));
      const userId_2: UserId = UserIdMother.random();
      component.userId = userId_2;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });

  describe('when user not logged', () => {
    it('should return false', () => {
      const userId: UserId = UserIdMother.random();
      component.userId = userId;

      spyOn(storeMock, 'select').and.returnValue(of(null));

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('false');
    });
  });
});
