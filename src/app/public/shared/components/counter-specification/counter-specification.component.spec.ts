import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSpecificationComponent } from './counter-specification.component';

describe('CounterSpecificationComponent', () => {
  let component: CounterSpecificationComponent;
  let fixture: ComponentFixture<CounterSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterSpecificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
