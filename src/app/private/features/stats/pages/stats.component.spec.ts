import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StatsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('loadMoreStats', () => {
    it('should emit paginate event', () => {
      spyOn(component.paginate, 'next');
      component.loadMoreStats();

      expect(component.paginate.next).toHaveBeenCalled();
    });
  });

  describe('stopPagination', () => {
    it('should stop stats pagination', () => {
      component.stopPagination();

      expect(component.pagination).toBe(false);
    });
  });

  describe('setLoadingStatus', () => {
    it('should set loading flag when fetching stats', () => {
      component.setLoadingStatus(false);

      expect(component.loading).toBe(false);
    });
  });
});
