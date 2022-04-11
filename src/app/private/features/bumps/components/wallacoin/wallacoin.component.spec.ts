import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WallacoinComponent } from './wallacoin.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WallacoinComponent', () => {
  let component: WallacoinComponent;
  let fixture: ComponentFixture<WallacoinComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WallacoinComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getSize', () => {
    it('should return true if size is medium', () => {
      component.size = 'medium';

      expect(component.getSize).toBe(true);
    });

    it('should return false if size is not medium', () => {
      component.size = 'small';

      expect(component.getSize).toBe(false);
    });
  });

  describe('hide', () => {
    it('should return false if currency is wallacoins', () => {
      component.currency = 'wallacoins';

      expect(component.hide).toBe(false);
    });
  });
});
