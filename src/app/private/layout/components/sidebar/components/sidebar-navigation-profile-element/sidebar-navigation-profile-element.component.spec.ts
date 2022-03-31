import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationProfileElementComponent } from './sidebar-navigation-profile-element.component';

describe('SidebarNavigationProfileElementComponent', () => {
  let component: SidebarNavigationProfileElementComponent;
  let fixture: ComponentFixture<SidebarNavigationProfileElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarNavigationProfileElementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNavigationProfileElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
