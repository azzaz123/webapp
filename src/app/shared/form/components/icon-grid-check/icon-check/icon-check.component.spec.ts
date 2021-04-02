import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCheckComponent } from './icon-check.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';

describe('IconCheckComponent', () => {
  let component: IconCheckComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<IconCheckComponent>;

  const labelPredicate = By.css('.IconCheck__label');
  const iconPredicate = By.directive(SvgIconComponent);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconCheckComponent],
      imports: [CommonModule, HttpClientTestingModule, SvgIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconCheckComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when has no label', () => {
    beforeEach(() => {
      component.label = undefined;
      fixture.detectChanges();
    });
    it('should show no label', () => {
      const label = debugElement.query(labelPredicate);

      expect(label).toBeFalsy();
    });
  });

  describe('when has label', () => {
    beforeEach(() => {
      component.label = 'My label';
      fixture.detectChanges();
    });
    it('should show label', () => {
      const label = debugElement.query(labelPredicate);

      expect(label).toBeTruthy();
    });
  });

  describe('when is not big', () => {
    beforeEach(() => {
      component.isBig = false;
      fixture.detectChanges();
    });
    it('should show icon smaller', () => {
      const icon: SvgIconComponent = debugElement.query(iconPredicate).componentInstance;

      expect(icon.height).toEqual(20);
      expect(icon.width).toEqual(20);
    });
  });

  describe('when is big', () => {
    beforeEach(() => {
      component.isBig = true;
      fixture.detectChanges();
    });
    it('show icon bigger', () => {
      const icon: SvgIconComponent = debugElement.query(iconPredicate).componentInstance;

      expect(icon.height).toEqual(30);
      expect(icon.width).toEqual(30);
    });
  });

  describe('when is active', () => {
    beforeEach(() => {
      component.isActive = true;
      component.label = 'My label';
      fixture.detectChanges();
    });
    it('should apply active classes', () => {
      const activeIcon = debugElement.query(By.css('.IconCheck__icon--active'));
      const activeLabel = debugElement.query(By.css('.IconCheck__label--active'));

      expect(activeIcon).toBeTruthy();
      expect(activeLabel).toBeTruthy();
    });
  });
});
