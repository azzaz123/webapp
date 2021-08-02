import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { fromEvent, Observable, of } from 'rxjs';
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
  @Input() categoryId: string = '1000'; // When PR: need to modify
  @ViewChild('hashtagSuggester', { static: true }) hashtagSuggester: ElementRef;
  @ViewChild(MultiSelectFormComponent) multiSelectFormComponent: MultiSelectFormComponent;
  @ViewChild('formMenu') formMenu: ElementRef;

  public selected: string[];
  public start: string = '0';
  public model: string;
  public options: SelectFormOption<string>[] = [];
  public suggestions: MultiSelectValue = [];
  public isClickOutside: boolean = false;
  public isValid: boolean = true;
  public hashtagPlaceholder: string = $localize`:@@web_upload_hashtag_placeholder:Find or create a hashtag`;
  private extendedOptions: MultiSelectFormOption[];

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

  public focus() {
    this.hashtagSuggester.nativeElement.placeholder = '#';
  }

  public blur() {
    this.hashtagSuggester.nativeElement.placeholder = $localize`:@@web_upload_hashtag_placeholder:Find or create a hashtag`;
  }

  public writeValue(value): void {
    this.value = value;
  }

  public handleSelectedOption(): void {
    this.value = this.mapExtendedOptionsToValue();
    this.onChange(this.value);
  }

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(
        debounceTime(750),
        switchMap(() => {
          this.suggestions = this.value;
          if (!this.isValidKey()) {
            return of([]);
          } else {
            if (this.model && !this.model.includes('#')) {
              this.model = `#${this.model}`;
            }
            return this.getHashtagSuggesters();
          }
        })
      )
      .subscribe((options: any) => {
        if (Array.isArray(options)) {
          this.options = options;
        } else {
          this.options = this.mapHashtagSuggestersToOptions(options);
        }
      });
  }

  public showOptions(): boolean {
    // when not click outside
    // when not clicking keyCode
    // when input not lose focus
    // when key isValid
    return !!this.options && this.isValidKey();
  }

  private getHashtagSuggesters(): Observable<PaginatedList<Hashtag>> {
    let newModel = this.model.substring(1);
    return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, this.start, newModel);
  }

  private mapHashtagSuggestersToOptions(hashtagList: PaginatedList<Hashtag>): SelectFormOption<string>[] {
    let { list } = hashtagList;
    if (!list.length && !!this.model) {
      return this.createHashtagSuggesterOption();
    }
    let options = list.map((hashtag: Hashtag) => {
      return { label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: `#${hashtag.text}` };
    });
    return options;
  }

  private createHashtagSuggesterOption(): SelectFormOption<string>[] {
    let newModel = this.model.substring(1);
    return [{ label: `#${newModel}`, value: `#${newModel}` }];
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
    const pattern: RegExp = /^#$|#?([\p{L}\p{Nd}])+$/u;
    if (!this.model) {
      this.isValid = true;
    } else {
      this.isValid = pattern.test(this.model);
    }
    return this.isValid;
  }
}
