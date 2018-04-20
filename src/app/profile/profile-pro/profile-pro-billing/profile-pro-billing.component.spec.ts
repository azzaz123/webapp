import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProBillingComponent } from './profile-pro-billing.component';

describe('ProfileProBillingComponent', () => {
  let component: ProfileProBillingComponent;
  let fixture: ComponentFixture<ProfileProBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
