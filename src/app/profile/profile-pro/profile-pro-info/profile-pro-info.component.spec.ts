import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProInfoComponent } from './profile-pro-info.component';

describe('ProfileProInfoComponent', () => {
  let component: ProfileProInfoComponent;
  let fixture: ComponentFixture<ProfileProInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
