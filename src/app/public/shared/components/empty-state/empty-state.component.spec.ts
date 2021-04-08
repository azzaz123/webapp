import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the drawing path...', () => {
    it('should show the drawing', () => {
      component.illustrationSrc = 'path';

      fixture.detectChanges();

      const svgDrawing = fixture.debugElement.query(By.css('img'));
      expect(svgDrawing).toBeTruthy();
    });
  });

  describe(`when we don't have the drawing path...`, () => {
    it(`shouldn't show the drawing`, () => {
      const svgDrawing = fixture.debugElement.query(By.css('img'));
      expect(svgDrawing).toBeFalsy();
    });
  });
});
