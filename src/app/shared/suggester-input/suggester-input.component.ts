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

  public showMenu(): boolean {
    return !!this.isValidKey() && !this.isClickOutside;
  }

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe((e) => {
        if (e['key'] === 'Escape') {
          this.closeForm();
        }
        if (!this.isValidKey()) {
          //this.showInvalidHashtagMessage = true;
          this.options = []; // When PR: To refactor
        } else {
          this.suggestions = this.value;
          this.getHashtags().subscribe((m) => {
            this.options = this.mapHashtagsToOptions(m);
            console.log('ext', this.extendedOptions);
          });
        }
      });
  }

  public writeValue(value): void {
    this.value = value;
  }

  public handleSelectedOption(): void {
    this.value = this.mapValue();
    this.onChange(this.value);
  }

  public getHashtags(): Observable<PaginatedList<Hashtag>> {
    /*     return of({
      list: [
        { text: 'aa', occurrencies: 40 },
        { text: 'gg', occurrencies: 2 },
        { text: 'ss', occurrencies: 10 },
      ],
      paginationParameter: '10',
    }); */
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

  private mapValue(): string[] {
    let newValue: string[];
    console.log('mapi', this.value, this.extendedOptions);
    this.extendedOptions.forEach((extendedOption: MultiSelectFormOption) => {
      if (extendedOption.checked) {
        newValue = this.value.concat(extendedOption.value);
        console.log('nn', newValue, extendedOption.value, this.value);
      } else {
        newValue = this.value.filter((n) => {
          return n !== extendedOption.value;
        });
      }
    });
    return newValue;
  }

  private isValidKey(): boolean {
    const pattern: RegExp = /^#?([\p{L}\p{Nd}])+$/u;
    if (this.model) {
      return pattern.test(this.model);
    } else return true;
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
