import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ViewEncapsulation } from '@angular/core';
import { KeywordSuggestion } from './keyword-suggestion.interface';
import { Subject } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import { FormGroup, FormControlName } from '@angular/forms';

@Component({
  selector: 'tsl-keyword-suggester',
  templateUrl: './keyword-suggester.component.html',
  styleUrls: ['./keyword-suggester.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KeywordSuggesterComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() placeholder: string;
  @Input() suggestions: Subject<KeywordSuggestion[]>;
  @Output() inputChange: EventEmitter<string> = new EventEmitter();
  @Output() handleSuggestionSelect: EventEmitter<any> = new EventEmitter();

  public keywordSuggestions: KeywordSuggestion[];
  public suggestionsOpened = false;
  public placeholderValue;
  private suggestionIndexSelected = -1;

  constructor(private i18n: I18nService) {}

  ngOnInit() {
    this.suggestions.subscribe((suggestions: KeywordSuggestion[]) => {
      this.keywordSuggestions = suggestions;
      this.suggestionsOpened = suggestions.length ? true : false;
    });
  }

  ngOnChanges(changes?) {
    if (changes.placeholder) {
      this.placeholderValue = this.i18n.translate(changes.placeholder.currentValue);
    }
  }

  inputValueChange(event: any) {
    this.suggestionIndexSelected = -1;
    this.inputChange.emit(event.target.value);
  }

  handleInputBlur() {
    this.suggestionsOpened = false;
  }

  selectSuggestion(suggestion: KeywordSuggestion) {
    if (this.controlName) {
      this.form.get(String(this.controlName)).patchValue(suggestion.suggestion);
    }
    this.handleSuggestionSelect.emit(suggestion.value);
    this.suggestionsOpened = false;
  }

  onKeydown(event: any) {
    if (this.keywordSuggestions && this.keywordSuggestions.length) {
      if (event.keyCode === 40 && this.suggestionIndexSelected < this.keywordSuggestions.length - 1) {
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
}
