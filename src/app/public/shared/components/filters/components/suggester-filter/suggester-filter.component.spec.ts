import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggesterFilterComponent } from './suggester-filter.component';

describe('SuggesterFilterComponent', () => {
  let component: SuggesterFilterComponent;
  let fixture: ComponentFixture<SuggesterFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggesterFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
