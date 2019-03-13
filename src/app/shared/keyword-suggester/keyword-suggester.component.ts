import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { KeywordSuggestion } from './keyword-suggestion.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'tsl-keyword-suggester',
  templateUrl: './keyword-suggester.component.html',
  styleUrls: ['./keyword-suggester.component.scss']
})
export class KeywordSuggesterComponent implements OnInit {

  @Input() value: Subject<string>;
  @Input() placeholder: string;
  @Input() initialValue: string;
  @Input() suggestions: Subject<KeywordSuggestion[]>;
  @Input() suggestionValue: string;
  @Output() inputChange: EventEmitter<string> = new EventEmitter();
  @Output() suggestionSelect: EventEmitter<any> = new EventEmitter();

  public keywordSuggestions: KeywordSuggestion[];
  public suggestionsOpened = false;
  private suggestionIndexSelected = -1;

  ngOnInit() {
    if (this.initialValue) {
      this.suggestionValue = this.initialValue;
    }
    this.suggestions.subscribe((suggestions: KeywordSuggestion[]) => {
      this.keywordSuggestions = suggestions;
      this.suggestionsOpened = suggestions.length ? true : false;
    });
    this.value.subscribe((value: string) => {
      this.suggestionValue = value;
    });
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
    this.suggestionValue = suggestion.suggestion;
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

}
