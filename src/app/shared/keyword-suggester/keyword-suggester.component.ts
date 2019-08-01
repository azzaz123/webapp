import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { KeywordSuggestion } from './keyword-suggestion.interface';
import { Subject } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-keyword-suggester',
  templateUrl: './keyword-suggester.component.html',
  styleUrls: ['./keyword-suggester.component.scss']
})
export class KeywordSuggesterComponent implements OnInit, OnChanges {

  @Input() value: Subject<string>;
  @Input() placeholder: string;
  @Input() initialValue: string;
  @Input() suggestions: Subject<KeywordSuggestion[]>;
  @Input() suggestionValue: string;
  @Output() inputChange: EventEmitter<string> = new EventEmitter();
  @Output() suggestionSelect: EventEmitter<any> = new EventEmitter();

  public keywordSuggestions: KeywordSuggestion[];
  public suggestionsOpened = false;
  public placeholderValue;
  private suggestionIndexSelected = -1;

  constructor(private i18n: I18nService) { }

  ngOnInit() {
    this.suggestions.subscribe((suggestions: KeywordSuggestion[]) => {
      this.keywordSuggestions = suggestions;
      this.suggestionsOpened = suggestions.length ? true : false;
    });
    this.value.subscribe((value: string) => {
      this.setSuggestionValue(value);
    });

    if (this.initialValue) {
      this.setSuggestionValue(this.initialValue);
    }
  }

  ngOnChanges(changes?) {
    if (changes.placeholder) {
      this.placeholderValue = this.i18n.getTranslations(changes.placeholder.currentValue);
    }
  }

  inputValueChange(event: any) {
    this.suggestionIndexSelected = -1;
    this.inputChange.emit(event.target.value);
  }

  handleInputBlur() {
    this.suggestionsOpened = false;
    this.suggestionSelect.emit(this.suggestionValue);
  }

  selectSuggestion(suggestion: KeywordSuggestion) {
    this.setSuggestionValue(suggestion.suggestion);
    this.suggestionSelect.emit(suggestion.value);
    this.suggestionsOpened = false;
  }

  onKeydown(event: any) {
    if (this.keywordSuggestions && this.keywordSuggestions.length) {
      if (event.keyCode === 40 && this.suggestionIndexSelected < (this.keywordSuggestions.length - 1)) {
        event.preventDefault();
        this.suggestionIndexSelected++;
      }
      if (event.keyCode === 38 && this.suggestionIndexSelected > -1) {
        event.preventDefault();
        this.suggestionIndexSelected--;
      }
      if (event.keyCode === 13) {
        event.preventDefault();
        if (this.suggestionIndexSelected !== -1) {
          this.selectSuggestion(this.keywordSuggestions[this.suggestionIndexSelected]);
        }
      }
      if (event.keyCode === 27 || event.keyCode === 13) {
        this.suggestionsOpened = false;
      }
    }
  }

  private setSuggestionValue(value) {
    this.suggestionValue = value;
  }

}
