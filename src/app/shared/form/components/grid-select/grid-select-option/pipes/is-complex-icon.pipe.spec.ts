import { TestBed } from '@angular/core/testing';
import { IsComplexIconPipe } from './is-complex-icon.pipe';
import { FormComplexIcon } from '@shared/form/interfaces/form-complex-icon.interface';

describe('IsComplexIconPipe', () => {
  const pipe: IsComplexIconPipe = new IsComplexIconPipe();
  const simpleIcon = 'icon.svg';
  const complexIcon: FormComplexIcon = {
    standard: 'standard.svg',
    active: 'active.svg',
    hover: 'hover.svg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsComplexIconPipe],
    }).compileComponents();
  });

  it('should return false when is simple icon', () => {
    const isComplex = pipe.transform(simpleIcon);

    expect(isComplex).toBeFalsy();
  });

  it('should return true when is complex icon', () => {
    const isComplex = pipe.transform(complexIcon);

    expect(isComplex).toBeTruthy();
  });
});
