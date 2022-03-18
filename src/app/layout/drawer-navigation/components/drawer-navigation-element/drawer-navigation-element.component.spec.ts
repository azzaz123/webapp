import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNavigationElementComponent } from './drawer-navigation-element.component';

describe('DrawerNavigationElementComponent', () => {
  let component: DrawerNavigationElementComponent;
  let fixture: ComponentFixture<DrawerNavigationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationElementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
