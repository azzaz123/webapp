import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNavigationChildPageComponent } from './drawer-navigation-child-page.component';

describe('DrawerNavigationChildPageComponent', () => {
  let component: DrawerNavigationChildPageComponent;
  let fixture: ComponentFixture<DrawerNavigationChildPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationChildPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationChildPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
