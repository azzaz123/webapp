import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublishedComponent } from './user-published.component';

describe('UserPublishedComponent', () => {
  let component: UserPublishedComponent;
  let fixture: ComponentFixture<UserPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPublishedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
