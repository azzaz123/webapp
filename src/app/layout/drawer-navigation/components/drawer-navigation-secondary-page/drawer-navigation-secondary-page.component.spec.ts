import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNavigationSecondaryPageComponent } from './drawer-navigation-secondary-page.component';

describe('DrawerNavigationSecondaryPageComponent', () => {
  let component: DrawerNavigationSecondaryPageComponent;
  let fixture: ComponentFixture<DrawerNavigationSecondaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationSecondaryPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationSecondaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
