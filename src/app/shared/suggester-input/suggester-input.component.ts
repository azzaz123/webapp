import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ContentChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
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
export class SuggesterInputComponent extends AbstractFormComponent<MultiSelectValue> implements OnInit, AfterViewInit {
  @Input() categoryId: string = '1000'; // When PR: need to modify
  @ViewChild('hashtagSuggester', { static: true }) hashtagSuggester: ElementRef;
  @ViewChild(MultiSelectFormComponent) multiSelectFormComponent: MultiSelectFormComponent;

  public selected: string[];
  public start: string = '0';
  public model: string;
  public options: SelectFormOption<string>[] = [];
  public suggestions: MultiSelectValue = [];

  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }
  ngOnInit() {
    this.detectTitleKeyboardChanges();
  }

  ngAfterViewInit() {
    this.suggestions = this.value;
  }

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => {
        if (!this.isValidKey()) {
          console.log('invalid');
          this.options = []; // When PR: To refactor
        } else
          this.getHashtags().subscribe((m) => {
            this.options = this.mapHashtagsToOptions(m);
          });
      });
  }

  public writeValue(value): void {
    this.value = value;
  }

  public handleSelectedOption(): void {
    console.log('onChange', this.value, this.suggestions, this.multiSelectFormComponent.extendedOptions$);
    //Here to manage the suggestions?
    this.onChange(this.value.concat(this.suggestions));
  }

  public isValidKey(): boolean {
    const pattern: RegExp = /^#?([\p{L}\p{Nd}])+$/u;
    if (this.model) {
      return pattern.test(this.model);
    } else return true;
  }

  public getHashtags(): Observable<PaginatedList<Hashtag>> {
    return of({ list: [], paginationParameter: '0' });
    // for the mean time
    //return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, this.start, this.model);
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
