import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLinksComponent } from './nav-links.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '../select/select.component';

describe('NavLinksComponent', () => {
  let component: NavLinksComponent;
  let fixture: ComponentFixture<NavLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ NavLinksComponent, SearchInputComponent, SelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
