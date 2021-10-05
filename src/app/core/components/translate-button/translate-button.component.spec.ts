import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateButtonComponent } from './translate-button.component';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TranslateButtonComponent', () => {
  const translateSelector = By.css('.TranslateButton__text--translate');
  const showOriginalSelector = By.css('.TranslateButton__text--show-original');
  let component: TranslateButtonComponent;
  let fixture: ComponentFixture<TranslateButtonComponent>;

  const copies = {
    showTranslation: 'Show me the translation!',
    showOriginal: 'Show me the original!',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslateButtonComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateButtonComponent);
    component = fixture.componentInstance;
    component.copies = copies;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when related text is not translated', () => {
    it('should have translate text', () => {
      component.isTranslated = false;

      fixture.detectChanges();

      const translateDebugElement = fixture.debugElement.query(translateSelector);

      expect(translateDebugElement).toBeTruthy();
      expect(translateDebugElement.nativeElement.innerHTML).toEqual(copies.showTranslation);
      expect(fixture.debugElement.query(showOriginalSelector)).toBeFalsy();
    });
  });

  describe('when related text is translated', () => {
    it('should have show original text', () => {
      component.isTranslated = true;

      fixture.detectChanges();

      const originalDebugElement = fixture.debugElement.query(showOriginalSelector);

      expect(fixture.debugElement.query(translateSelector)).toBeFalsy();
      expect(originalDebugElement).toBeTruthy();
      expect(originalDebugElement.nativeElement.innerHTML).toEqual(copies.showOriginal);
    });
  });
});
