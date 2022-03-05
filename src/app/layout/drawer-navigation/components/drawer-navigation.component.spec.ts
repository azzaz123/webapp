import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNavigationComponent } from './drawer-navigation.component';

describe('DrawerNavigationComponent', () => {
  let component: DrawerNavigationComponent;
  let fixture: ComponentFixture<DrawerNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
