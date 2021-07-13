import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggesterInputComponent } from './suggester-input.component';

describe('DynamicInputComponent', () => {
  let component: SuggesterInputComponent;
  let fixture: ComponentFixture<SuggesterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggesterInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
