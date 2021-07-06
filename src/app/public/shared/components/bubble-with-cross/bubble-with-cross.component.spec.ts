import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleWithCrossComponent } from './bubble-with-cross.component';

describe('BubbleWithCrossComponent', () => {
  let component: BubbleWithCrossComponent;
  let fixture: ComponentFixture<BubbleWithCrossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BubbleWithCrossComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleWithCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
