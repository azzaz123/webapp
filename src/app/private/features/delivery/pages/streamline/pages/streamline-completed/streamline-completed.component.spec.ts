import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineCompletedComponent } from './streamline-completed.component';

describe('StreamlineCompletedComponent', () => {
  let component: StreamlineCompletedComponent;
  let fixture: ComponentFixture<StreamlineCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamlineCompletedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
