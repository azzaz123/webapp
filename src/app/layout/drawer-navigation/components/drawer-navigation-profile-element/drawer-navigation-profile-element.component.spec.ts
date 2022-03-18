import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNavigationProfileElementComponent } from './drawer-navigation-profile-element.component';

describe('DrawerNavigationProfileElementComponent', () => {
  let component: DrawerNavigationProfileElementComponent;
  let fixture: ComponentFixture<DrawerNavigationProfileElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationProfileElementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationProfileElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
