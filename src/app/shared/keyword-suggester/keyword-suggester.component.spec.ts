import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordSuggesterComponent } from './keyword-suggester.component';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n/i18n.service';
import { Subject } from 'rxjs';
import { KeywordSuggestion } from './keyword-suggestion.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const MOCK_SUGGESTION: KeywordSuggestion = {
  suggestion: 'Samsung Galaxy S7',
  value: { brand: 'Samsung', model: 'Galaxy S7' }
};

describe('KeywordSuggesterComponent', () => {
  let component: KeywordSuggesterComponent;
  let fixture: ComponentFixture<KeywordSuggesterComponent>;
  let i18n: I18nService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeywordSuggesterComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: I18nService, useValue: {
            getTranslations() {
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordSuggesterComponent);
    component = fixture.componentInstance;
    i18n = TestBed.inject(I18nService);
    component.suggestions = new Subject();
    component.placeholder = 'Brand';
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should get the translation for the placeholder', () => {
      spyOn(i18n, 'getTranslations').and.callThrough();

      component.ngOnChanges({ placeholder: { currentValue: 'Brand' } });

      expect(i18n.getTranslations).toHaveBeenCalledWith('Brand');
    });
  });

  describe(('inputValueChange'), () => {
    it('should emit the inputChange event with the input value', () => {
      const inputEvent = { target: { value: 'iPhone' } };
      spyOn(component.inputChange, 'emit');

      component.inputValueChange(inputEvent);

      expect(component.inputChange.emit).toHaveBeenCalledWith('iPhone');
    });
  });

  describe(('handleInputBlur'), () => {
    it('should hide the suggestions element', () => {
      component.suggestionsOpened = true;

      component.handleInputBlur();

      expect(component.suggestionsOpened).toBe(false);
    });
  });

  describe(('selectSuggestion'), () => {
    it('should hide the suggestions element', () => {
      component.suggestionsOpened = true;
      
      component.selectSuggestion(MOCK_SUGGESTION);

      expect(component.suggestionsOpened).toBe(false);
    });
  });

  describe(('onKeydown'), () => {
    beforeEach(() => {
      component.keywordSuggestions = [MOCK_SUGGESTION];
    });

    it('should hide the suggestions element when pressing the ESC key', () => {
      component.suggestionsOpened = true;
      const keyEvent = { keyCode: 13, preventDefault: jasmine.createSpy('preventDefault') };

      component.onKeydown(keyEvent);

      expect(component.suggestionsOpened).toBe(false);
    });

    it('should hide the suggestions element when pressing the RETURN key', () => {
      component.suggestionsOpened = true;
      const keyEvent = { keyCode: 13, preventDefault: jasmine.createSpy('preventDefault') };

      component.onKeydown(keyEvent);

      expect(component.suggestionsOpened).toBe(false);
    });

    it('should call the selectSuggestion function with the selected suggestion when pressing the RETURN key', () => {
      spyOn(component, 'selectSuggestion');

      component.suggestionsOpened = true;
      const keyDownEvent = { keyCode: 40, preventDefault: jasmine.createSpy('preventDefault') };
      const keyReturnEvent = { keyCode: 13, preventDefault: jasmine.createSpy('preventDefault') };

      component.onKeydown(keyDownEvent);
      component.onKeydown(keyReturnEvent);

      expect(component.selectSuggestion).toHaveBeenCalledWith(MOCK_SUGGESTION);
    });
  });

});
