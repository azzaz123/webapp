import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchErrorLayoutComponent } from './search-error-layout.component';

describe('SearchErrorLayoutComponent', () => {
  let component: SearchErrorLayoutComponent;
  let fixture: ComponentFixture<SearchErrorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchErrorLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchErrorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
