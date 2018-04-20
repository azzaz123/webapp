import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardCallsComponent } from './user-card-calls.component';

describe('UserCardCallsComponent', () => {
  let component: UserCardCallsComponent;
  let fixture: ComponentFixture<UserCardCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCardCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
