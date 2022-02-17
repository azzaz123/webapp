import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableMovableMapComponent } from './searchable-movable-map.component';

describe('SearchableMovableMapComponent', () => {
  let component: SearchableMovableMapComponent;
  let fixture: ComponentFixture<SearchableMovableMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchableMovableMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableMovableMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
