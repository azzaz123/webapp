import { TestBed } from '@angular/core/testing';
import { IsBubblePipe } from './is-bubble.pipe';
import { FILTER_VARIANT } from '../abstract-filter.enum';

describe('IsComplexIconPipe', () => {
  const pipe: IsBubblePipe = new IsBubblePipe();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsBubblePipe],
    }).compileComponents();
  });

  it('should return true when variant is bubble', () => {
    const isBubble = pipe.transform(FILTER_VARIANT.BUBBLE);

    expect(isBubble).toBeTruthy();
  });

  it('should return false when variant is content', () => {
    const isComplex = pipe.transform(FILTER_VARIANT.CONTENT);

    expect(isComplex).toBeFalsy();
  });
});
