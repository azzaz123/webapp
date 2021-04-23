import { TestBed } from '@angular/core/testing';
import { ShouldHideIconPipe } from '@shared/form/components/grid-select/grid-select-option/pipes/should-hide-icon.pipe';
import { ICON_STATUS } from '@shared/form/components/grid-select/grid-select-option/enums/icon-status.enum';

describe('ShouldHideIconPipe', () => {
  const pipe: ShouldHideIconPipe = new ShouldHideIconPipe();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShouldHideIconPipe],
    }).compileComponents();
  });

  describe('when icon status is standard', () => {
    it('should return true if current status is standard', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.STANDARD, ICON_STATUS.STANDARD);

      expect(shouldHideIcon).toBeFalsy();
    });
    it('should return false if current status is hover', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.HOVER, ICON_STATUS.STANDARD);

      expect(shouldHideIcon).toBeTruthy();
    });
    it('should return false if current status is active', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.ACTIVE, ICON_STATUS.STANDARD);

      expect(shouldHideIcon).toBeTruthy();
    });
  });

  describe('when icon status is hover', () => {
    it('should return false if current status is standard', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.STANDARD, ICON_STATUS.HOVER);

      expect(shouldHideIcon).toBeTruthy();
    });
    it('should return true if current status is hover', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.HOVER, ICON_STATUS.HOVER);

      expect(shouldHideIcon).toBeFalsy();
    });
    it('should return false if current status is active', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.ACTIVE, ICON_STATUS.HOVER);

      expect(shouldHideIcon).toBeTruthy();
    });
  });

  describe('when icon status is active', () => {
    it('should return false if current status is standard', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.STANDARD, ICON_STATUS.ACTIVE);

      expect(shouldHideIcon).toBeTruthy();
    });
    it('should return false if current status is hover', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.HOVER, ICON_STATUS.ACTIVE);

      expect(shouldHideIcon).toBeTruthy();
    });
    it('should return true if current status is active', () => {
      const shouldHideIcon = pipe.transform(ICON_STATUS.ACTIVE, ICON_STATUS.ACTIVE);

      expect(shouldHideIcon).toBeFalsy();
    });
  });
});
