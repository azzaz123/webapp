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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslateButtonComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateButtonComponent);
    component = fixture.componentInstance;
    component.copies = {
      showTranslation: 'Show me the translation!',
      showOriginal: 'Show me the original!',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when related text is not translated', () => {
    it('should have translate text', () => {
      component.isTranslated = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(translateSelector)).toBeTruthy();
      expect(fixture.debugElement.query(showOriginalSelector)).toBeFalsy();
    });
  });

  describe('when related text is translated', () => {
    it('should have show original text', () => {
      component.isTranslated = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(translateSelector)).toBeFalsy();
      expect(fixture.debugElement.query(showOriginalSelector)).toBeTruthy();
    });
  });
});
