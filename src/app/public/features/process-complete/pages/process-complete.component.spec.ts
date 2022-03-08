import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCompleteComponent } from './process-complete.component';

describe('ProcessCompleteComponent', () => {
  let component: ProcessCompleteComponent;
  let fixture: ComponentFixture<ProcessCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessCompleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
