import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoComponent } from './user-info.component';

describe('UserInfoComponent', () => {
  const mapTag = 'tsl-here-maps';
  const userResponseTag = 'tsl-user-response-rate';
  const containerClass = 'UserInfo';

  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is not defined...', () => {
    it('should NOT show the user info', () => {});
  });

  describe('when the user is defined...', () => {
    it('should show the user info', () => {});

    describe('when the user NOT have coordinates', () => {
      it('should NOT show the map', () => {});
    });

    describe('when the user have coordinates', () => {
      it('should show the map', () => {});
    });
  });
});
