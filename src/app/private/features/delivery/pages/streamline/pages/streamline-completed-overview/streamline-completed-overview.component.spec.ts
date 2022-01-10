import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineCompletedOverviewComponent } from './streamline-completed-overview.component';

describe('StreamlineCompletedOverviewComponent', () => {
  let component: StreamlineCompletedOverviewComponent;
  let fixture: ComponentFixture<StreamlineCompletedOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamlineCompletedOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineCompletedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
