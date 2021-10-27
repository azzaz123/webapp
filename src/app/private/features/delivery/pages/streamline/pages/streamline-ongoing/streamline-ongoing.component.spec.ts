import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineOngoingComponent } from './streamline-ongoing.component';

describe('StreamlineOngoingComponent', () => {
  let component: StreamlineOngoingComponent;
  let fixture: ComponentFixture<StreamlineOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamlineOngoingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
