import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { fromEvent, Observable, of } from 'rxjs';
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
  private extendedOptions: MultiSelectFormOption[];

  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService, private renderer: Renderer2) {
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

  public writeValue(value): void {
    this.value = value;
  }

  public handleSelectedOption(): void {
    this.value = this.mapExtendedOptionsToValue();
    this.onChange(this.value);
  }

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe((e) => {
        if (e['key'] === 'Escape') {
          this.closeForm();
        }
        if (!this.isValidKey()) {
          this.options = []; // When PR: To refactor
        } else {
          this.suggestions = this.value;
          this.getHashtagSuggesters().subscribe((m) => {
            this.options = this.mapHashtagSuggestersToOptions(m);
          });
        }
      });
  }

  public showOptions(): boolean {
    return !!this.isValidKey() && !this.isClickOutside;
  }

  private getHashtagSuggesters(): Observable<PaginatedList<Hashtag>> {
    return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, this.start, this.model);
  }

  private mapHashtagSuggestersToOptions(hashtagList: PaginatedList<Hashtag>): SelectFormOption<string>[] {
    let { list } = hashtagList;
    if (!list.length && !!this.model) {
      return this.createHashtagSuggesterOption();
    }
    let options = list.map((hashtag: Hashtag) => {
      //return { label: hashtag.text, sublabel: hashtag.occurrencies.toString(), value: hashtag.text };
      return { label: hashtag.text, value: hashtag.text };
    });
    return options;
  }

  private createHashtagSuggesterOption(): SelectFormOption<string>[] {
    return [{ label: this.model, value: this.model }];
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

  private isValidKey(): boolean {
    const pattern: RegExp = /^#?([\p{L}\p{Nd}])+$/u;
    if (this.model) {
      return pattern.test(this.model);
    } else {
      return true;
    }
  }

  private closeForm() {
    this.isClickOutside = true;
  }

  private onClickOutsideForm() {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.formMenu.nativeElement) {
        this.isClickOutside = true;
      }
    });
  }
}
