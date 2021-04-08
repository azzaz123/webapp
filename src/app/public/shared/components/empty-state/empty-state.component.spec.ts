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

  describe('when we have the image path...', () => {
    it('should show the illustration', () => {
      component.illustrationSrc = 'path';

      fixture.detectChanges();

      const illustration = fixture.debugElement.query(By.css('img'));
      expect(illustration).toBeTruthy();
    });
  });

  describe(`when we don't have the image path...`, () => {
    it(`shouldn't show the illustration`, () => {
      const illustration = fixture.debugElement.query(By.css('img'));
      expect(illustration).toBeFalsy();
    });
  });
});
