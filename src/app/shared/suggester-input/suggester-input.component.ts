import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
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
  @Input() categoryId: string;
  @Input() disabled: boolean;
  @ViewChild('hashtagSuggesterInput', { static: true }) hashtagSuggesterInput: ElementRef;
  @ViewChild(MultiSelectFormComponent) multiSelectFormComponent: MultiSelectFormComponent;
  @ViewChild('hashtagSuggesterOptions') hashtagSuggesterOptions: ElementRef;
  @Output() showInvalidMessage = new EventEmitter<boolean>();

  public selected: string[];
  public searchValue: string;
  public options: SelectFormOption<string>[] = [];
  public suggestions: MultiSelectValue = [];
  public isValid: boolean = true;
  public hashtagPlaceholder: string = $localize`:@@web_upload_hashtag_placeholder:Find or create a hashtag`;
  public showOptions: boolean;
  public keyUpSubject = new Subject<KeyboardEvent>();
  private extendedOptions: MultiSelectFormOption[];
  private keyUp$: Observable<unknown>;
  private subscriptions = new Subscription();

  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }
  ngOnInit() {
    this.detectTitleKeyboardChanges();
  }

  ngAfterViewInit() {
    this.multiSelectFormComponent.extendedOptions$.subscribe((extendedOptions) => {
      this.extendedOptions = extendedOptions;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:click', ['$event']) onWindowClick(n: Event) {
    if ((n.target as HTMLElement).contains(this.hashtagSuggesterOptions.nativeElement)) {
      this.emptyOptions();
    }
  }

  public keyUp(event): void {
    if (event.key === 'Escape') {
      this.emptyOptions();
      return;
    }
    if (!this.isValidKey()) {
      this.showInvalidMessage.emit(!this.isValid);
      this.emptyOptions();
      return;
    }
    if (this.searchValue.length >= 1 && !this.searchValue.includes('#')) {
      this.searchValue = `#${this.searchValue}`;
    }
    this.keyUpSubject.next(event);
  }

  public focus() {
    this.hashtagPlaceholder = '#';
  }

  public blur() {
    this.hashtagPlaceholder = $localize`:@@web_upload_hashtag_placeholder:Find or create a hashtag`;
  }

  public writeValue(value): void {
    this.value = value;
  }

  public handleSelectedOption(): void {
    this.value = this.mapExtendedOptionsToValue();
    this.onChange(this.value);
  }

  public detectTitleKeyboardChanges(): void {
    this.keyUp$ = this.keyUpSubject.pipe(
      debounceTime(750),
      switchMap(() => {
        this.suggestions = this.value;
        if (this.isValid) {
          return this.getHashtagSuggesters();
        } else return of([]);
      })
    );

    this.subscriptions.add(
      this.keyUp$.subscribe((options: PaginatedList<Hashtag> | []) => {
        if (Array.isArray(options)) {
          this.options = options;
        } else {
          this.options = this.mapHashtagSuggestersToOptions(options);
        }
      })
    );
  }

  public emptyOptions(): void {
    this.options = [];
  }

  private getHashtagSuggesters(): Observable<PaginatedList<Hashtag> | []> {
    let newSearchValue = this.searchValue.substring(1);
    if (!newSearchValue) {
      return of([]);
    } else {
      return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, newSearchValue);
    }
  }

  private mapHashtagSuggestersToOptions(hashtagList: PaginatedList<Hashtag>): SelectFormOption<string>[] {
    let { list } = hashtagList;
    if (!list.length && !!this.searchValue) {
      return this.createHashtagSuggesterOption();
    }
    let options = list.map((hashtag: Hashtag) => {
      return { label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: `#${hashtag.text}` };
    });
    if (options[0].label !== this.searchValue) {
      return this.sliceOptions([...this.createHashtagSuggesterOption(), ...options]);
    } else {
      return this.sliceOptions(options);
    }
  }

  private sliceOptions(options: SelectFormOption<string>[]): SelectFormOption<string>[] {
    if (options.length > 4) {
      return options.slice(0, 4);
    } else return options;
  }

  private createHashtagSuggesterOption(): SelectFormOption<string>[] {
    let newSearchValue = this.searchValue.substring(1);
    if (!!newSearchValue) {
      return [{ label: `#${newSearchValue}`, sublabel: '0', value: `#${newSearchValue}` }];
    } else return [];
  }

  private mapExtendedOptionsToValue(): string[] {
    let newValue: string[] = this.value;
    this.extendedOptions.forEach((option: MultiSelectFormOption) => {
      if (option.checked && !this.value.includes(option.value)) {
        newValue = newValue.concat(option.value);
      }

      if (!option.checked && this.value.includes(option.value)) {
        newValue = newValue.filter((value) => {
          return value !== option.value;
        });
      }
    });

    return newValue;
  }

  public isValidKey(): boolean {
    const pattern: RegExp = /^#$|^#?([\p{L}\p{Nd}])+$/u;
    if (!this.searchValue) {
      this.isValid = true;
    } else {
      this.isValid = pattern.test(this.searchValue);
    }
    this.showInvalidMessage.emit(!this.isValid);
    return this.isValid;
  }
}
