import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResponseRateComponent } from './user-response-rate.component';

describe('UserResponseRateComponent', () => {
  let component: UserResponseRateComponent;
  let fixture: ComponentFixture<UserResponseRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResponseRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponseRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
