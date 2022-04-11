import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tsl-multi-select-search-input',
  templateUrl: './multi-select-search-input.component.html',
  styleUrls: ['./multi-select-search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectSearchInputComponent),
      multi: true,
    },
  ],
})
export class MultiselectSearchInputComponent extends AbstractFormComponent<MultiSelectValue> implements OnInit, OnDestroy {
  @Input() categoryId: string;
  @Input() isDisabled: boolean;
  @Input() max: number;
  @ViewChild('hashtagSuggesterInput', { static: true }) hashtagSuggesterInput: ElementRef;
  @ViewChild(MultiSelectFormComponent) multiSelectFormComponent: MultiSelectFormComponent;
  @ViewChild('hashtagSuggesterOptions') hashtagSuggesterOptions: ElementRef;
  @Output() changeValidStatus = new EventEmitter<boolean>();

  public selected: string[];
  public searchValue: string;
  public suggestions: MultiSelectValue = [];
  public isValid: boolean = true;
  public hashtagPlaceholder: string = $localize`:@@hashtags_view_search_bar_placeholder:Find or create a hashtag`;
  public keyUpSubject = new Subject<KeyboardEvent>();
  private optionsSubject = new Subject<MultiSelectFormOption[]>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public options$: Observable<MultiSelectFormOption[]> = this.optionsSubject.asObservable();
  private keyUp$: Observable<unknown>;
  private subscriptions = new Subscription();

  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }
  @HostListener('window:click', ['$event']) onWindowClick(n: Event) {
    const optionsList = this.hashtagSuggesterOptions.nativeElement.querySelector('tsl-multi-select-form');

    if (!optionsList.contains(n.target)) {
      this.emptyOptions();
      this.searchValue = '';
      this.isValid = true;
      this.changeValidStatus.emit(this.isValid);
    }
  }
  ngOnInit() {
    this.detectTitleKeyboardChanges();
  }

  handleChange(): void {
    this.value = this.suggestions;
    this.onChange(this.value);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public isValidKey(): boolean {
    const pattern: RegExp = /^#$|^#?([\p{L}\p{Nd}])+$/u;
    if (this.searchValue) {
      this.isValid = pattern.test(this.searchValue);
    } else {
      this.isValid = true;
    }
    this.changeValidStatus.emit(this.isValid);
    return this.isValid;
  }

  public detectTitleKeyboardChanges(): void {
    this.keyUp$ = this.keyUpSubject.pipe(
      debounceTime(750),
      switchMap(() => {
        this.suggestions = this.value;
        if (this.isValid) {
          return this.getHashtagSuggesters();
        }
      })
    );

    this.subscriptions.add(
      this.keyUp$.subscribe((options: PaginatedList<Hashtag> | []) => {
        if (Array.isArray(options)) {
          this.optionsSubject.next(options);
        } else {
          this.optionsSubject.next(this.mapHashtagSuggestersToOptions(options));
        }
      })
    );
  }

  public emptyOptions(): void {
    this.optionsSubject.next([]);
  }

  public keyUp(event): void {
    if (event.key === 'Escape') {
      this.emptyOptions();
      return;
    }
    if (!this.isValidKey()) {
      this.changeValidStatus.emit(this.isValid);
      this.emptyOptions();
      return;
    }
    if (this.searchValue.length >= 1 && !this.searchValue.includes('#')) {
      this.searchValue = `#${this.searchValue}`;
    }
    this.keyUpSubject.next(event);
  }

  public focus(): void {
    this.hashtagPlaceholder = '#';
  }

  public blur(): void {
    this.hashtagPlaceholder = $localize`:@@hashtags_view_search_bar_placeholder:Find or create a hashtag`;
  }

  public writeValue(value): void {
    this.value = value;
  }

  private getHashtagSuggesters(): Observable<PaginatedList<Hashtag> | []> {
    const newSearchValue = this.searchValue.substring(1);
    if (!newSearchValue) {
      return of([]);
    } else {
      return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, newSearchValue); // TODO I DON'T WANT THIS HERE, PASS IT AS CONFIG OR STH.
    }
  }

  private mapHashtagSuggestersToOptions(hashtagList: PaginatedList<Hashtag>): MultiSelectFormOption[] {
    const { list } = hashtagList;
    if (!list.length && !!this.searchValue) {
      return this.createHashtagSuggesterOption();
    }
    const options = list.map((hashtag: Hashtag) => {
      return { label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: hashtag.text };
    });
    if (options[0].label !== this.searchValue) {
      return this.sliceOptions([...this.createHashtagSuggesterOption(), ...options]);
    }

    return this.sliceOptions(options);
  }

  private sliceOptions(options: MultiSelectFormOption[]): MultiSelectFormOption[] {
    return options.length > 4 ? options.slice(0, 4) : options;
  }

  private createHashtagSuggesterOption(): MultiSelectFormOption[] {
    const newSearchValue = this.searchValue.substring(1);
    if (!!newSearchValue) {
      return [{ label: `#${newSearchValue}`, value: newSearchValue }];
    }
  }
}
