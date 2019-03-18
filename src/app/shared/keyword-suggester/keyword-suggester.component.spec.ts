import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordSuggesterComponent } from './keyword-suggester.component';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n/i18n.service';
import { Subject } from 'rxjs';
import { KeywordSuggestion } from './keyword-suggestion.interface';

const MOCK_SUGGESTION: KeywordSuggestion = {
  suggestion: 'Samsung Galaxy S7',
  value: { brand: 'Samsung', model: 'Galaxy S7' }
};

fdescribe('KeywordSuggesterComponent', () => {
  let component: KeywordSuggesterComponent;
  let fixture: ComponentFixture<KeywordSuggesterComponent>;
  let i18n: I18nService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [KeywordSuggesterComponent],
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
    i18n = TestBed.get(I18nService);
    component.value = new Subject();
    component.suggestions = new Subject();
    component.placeholder = 'Brand';
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set the initial value if it`s provided', () => {
      component.initialValue = 'Apple';

      component.ngOnInit();

      expect(component.suggestionValue).toEqual('Apple');
    });

    it('should get the translation for the placeholder', () => {
      spyOn(i18n, 'getTranslations').and.callThrough();

      component.ngOnInit();

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
    it('should emit the suggestionSelect event with the input value', () => {
      spyOn(component.suggestionSelect, 'emit');

      component.suggestionValue = 'iPhone XS';
      component.handleInputBlur();

      expect(component.suggestionSelect.emit).toHaveBeenCalledWith('iPhone XS');
    });

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

    it('should emit the suggestionSelect event with the suggestion value', () => {
      spyOn(component.suggestionSelect, 'emit');

      component.selectSuggestion(MOCK_SUGGESTION);

      expect(component.suggestionSelect.emit).toHaveBeenCalledWith(MOCK_SUGGESTION.value);
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
