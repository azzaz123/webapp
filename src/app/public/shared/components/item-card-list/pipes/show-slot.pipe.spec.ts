import { TestBed } from '@angular/core/testing';
import { ShowSlotPipe } from './show-slot.pipe';

describe('ShowSlotPipe', () => {
  const pipe: ShowSlotPipe = new ShowSlotPipe();
  const slotsConfig = {
    start: 3,
    offset: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowSlotPipe],
    }).compileComponents();
  });

  it('should not show any slots before the start ', () => {
    const index = slotsConfig.start - 1;

    const showSlot = pipe.transform(index, slotsConfig);

    expect(showSlot).toBeFalsy();
  });

  it('should show slot if is the start ', () => {
    const index = slotsConfig.start;

    const showSlot = pipe.transform(index, slotsConfig);

    expect(showSlot).toBeTruthy();
  });

  it('should show slot if matches the offset ', () => {
    const randomMultiplier = Math.trunc(Math.random() * (100 - 1) + 1);
    const index = slotsConfig.start + slotsConfig.offset * randomMultiplier;

    const showSlot = pipe.transform(index, slotsConfig);

    expect(showSlot).toBeTruthy();
  });
});
