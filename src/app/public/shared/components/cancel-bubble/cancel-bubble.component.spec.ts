import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBubbleComponent } from './cancel-bubble.component';

describe('CancelBubbleComponent', () => {
  let component: CancelBubbleComponent;
  let fixture: ComponentFixture<CancelBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelBubbleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
