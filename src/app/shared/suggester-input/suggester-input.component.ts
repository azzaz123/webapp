import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewChild, OnChange } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HashtagSuggesterApiService } from '../../private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
@Component({
  selector: 'tsl-suggester-input',
  templateUrl: './suggester-input.component.html',
  styleUrls: ['./suggester-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SuggesterInputComponent),
      multi: true,
    },
  ],
})
export class SuggesterInputComponent extends AbstractFormComponent<MultiSelectValue> implements OnInit {
  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }
  ngOnInit() {
    this.detectTitleKeyboardChanges();
  }
  @Input() categoryId: string = '1000'; // When PR: need to modify
  @ViewChild('hashtagSuggester', { static: true }) hashtagSuggester: ElementRef;
  public selected: string[];
  public start: string = '0';
  public model: string;
  public options: SelectFormOption<string>[] = [];
  public suggestions: MultiSelectValue = [];

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => {
        if (!this.isValidKey()) {
          console.log('not valid');
          return;
        } else
          this.getHashtags().subscribe((m) => {
            this.options = this.mapHashtagsToOptions(m);
          });
      });
  }

  public writeValue(value): void {
    this.value = value;
    console.log('value', this.value);
  }

  public handleSelectedOption(): void {
    console.log('handle option', this.value, this.suggestions);

    this.onChange(this.value.concat(this.suggestions));
  }

  public isValidKey(): boolean {
    // filter valid key,  managemge space key (whether we want to put space in prefix) - AC8

    /*  const pattern: RegExp = /#([\\p{L}]+[\\p{N}_]*)+/m;
    //    const pattern: RegExp = /^(?=.{1,50}$)[\p{L}\p{M}\\p{N}\p{Me}€$\+]+(?:[-–_]?[\p{L}\p{M}\p{N}\p{Me}]+|[\p{L}\p{M}\p{N}\p{Me}]*)$/;
    console.log('tt', this.model, pattern.test(this.model));
    return pattern.test(this.model); */
    return true;
  }

  public getHashtags(): Observable<PaginatedList<Hashtag>> {
    return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, this.start, this.model);
  }

  public mapHashtagsToOptions(hashtagList: PaginatedList<Hashtag>): SelectFormOption<string>[] {
    let { list } = hashtagList;
    if (!list.length && !!this.model) {
      return this.createHashtagOption();
    }
    let options = list.map((hashtag: Hashtag) => {
      return { label: hashtag.text, sublabel: hashtag.occurrencies.toString(), value: hashtag.text };
    });
    return options;
  }

  public createHashtagOption(): SelectFormOption<string>[] {
    return [{ label: this.model, value: this.model }];
  }
}
