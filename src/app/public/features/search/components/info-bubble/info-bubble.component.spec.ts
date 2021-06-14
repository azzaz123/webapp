import { TestBed } from '@angular/core/testing';
import { InfoBubbleComponent } from './info-bubble.component';

describe('InfoBubbleComponent', () => {
  let component: InfoBubbleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [InfoBubbleComponent],
      providers: [],
    }).compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
