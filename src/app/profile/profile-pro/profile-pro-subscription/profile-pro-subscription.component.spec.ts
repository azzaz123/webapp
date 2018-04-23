import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProSubscriptionComponent } from './profile-pro-subscription.component';

describe('ProfileProSubscriptionComponent', () => {
  let component: ProfileProSubscriptionComponent;
  let fixture: ComponentFixture<ProfileProSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
