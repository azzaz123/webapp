import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EmptyStateComponent, SvgIconComponent],
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

      const svgDrawing = fixture.debugElement.query(By.directive(SvgIconComponent));
      expect(svgDrawing).toBeTruthy();
    });
  });

  describe(`when we don't have the drawing path...`, () => {
    it(`shouldn't show the drawing`, () => {
      const svgDrawing = fixture.debugElement.query(By.directive(SvgIconComponent));
      expect(svgDrawing).toBeFalsy();
    });
  });
});
