import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { Hashtag } from '../../core/models/hashtag.interface';
import { HashtagSuggesterApiService } from '../../core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { union, isEqual } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import {
  MultiSelectFormOption,
  TemplateMultiSelectFormOption,
} from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiselectSearchInputComponent } from '@shared/form/components/multiselect-search-input/multiselect-search-input.component';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export enum HASHTAG_TYPE {
  SEARCHED,
  SUGGESTED,
}
@Component({
  selector: 'tsl-hashtag-field',
  templateUrl: './hashtag-field.component.html',
  styleUrls: ['./hashtag-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HashtagFieldComponent),
      multi: true,
    },
  ],
})
export class HashtagFieldComponent extends AbstractFormComponent<MultiSelectValue> implements OnInit, AfterViewInit {
  @Input() set categoryId(value: string) {
    this._categoryId = value;
    this.getSuggestedOptions(0);
  }
  @Input() max: number;
  @ViewChild(MultiSelectFormComponent, { static: true }) suggestedHashtagsComponent: MultiSelectFormComponent; // cambiar nombre
  @ViewChild(MultiselectSearchInputComponent, { static: true }) searchedHashtagsComponent: MultiselectSearchInputComponent; // cambiar nombre

  public hashtagForm: FormGroup = new FormGroup({
    [HASHTAG_TYPE.SEARCHED]: new FormControl(),
    [HASHTAG_TYPE.SUGGESTED]: new FormControl(),
  });

  public readonly HASHTAG_TYPE = HASHTAG_TYPE;
  public showSearchedErrorMessage = false;

  private maxReachedSubject = new BehaviorSubject<boolean>(false);
  private suggestedOptionsSubject = new BehaviorSubject<MultiSelectFormOption[]>([]);
  private suggestedOptions: MultiSelectFormOption[] = [];
  private suggestedOptionsPage;
  private _categoryId: string;

  private searchedExtendedOptions: TemplateMultiSelectFormOption[] = [];
  private suggestedExtendedOptions: TemplateMultiSelectFormOption[] = [];

  constructor(private hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }

  public get categoryId(): string {
    return this._categoryId;
  }
  public get suggestedOptions$(): Observable<MultiSelectFormOption[]> {
    return this.suggestedOptionsSubject.asObservable();
  }

  public get maxReached$(): Observable<boolean> {
    return this.maxReachedSubject.asObservable();
  }

  ngOnInit() {
    this.maxReached$.pipe(filter((maxReached) => maxReached)).subscribe(() => {
      this.searchedHashtagsComponent.emptyOptions();
      this.searchedHashtagsComponent.searchValue = '';
    });

    this.hashtagForm.controls[HASHTAG_TYPE.SEARCHED].valueChanges
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .subscribe(() => {
        this.manageFormChanges(this.searchedExtendedOptions, HASHTAG_TYPE.SEARCHED);
      });

    this.hashtagForm.controls[HASHTAG_TYPE.SUGGESTED].valueChanges.subscribe(() => {
      this.manageFormChanges(this.suggestedExtendedOptions, HASHTAG_TYPE.SUGGESTED);
    });
  }

  ngAfterViewInit(): void {
    this.searchedHashtagsComponent.multiSelectFormComponent.extendedOptions$.subscribe(
      (extendedOptions: TemplateMultiSelectFormOption[]) => {
        this.searchedExtendedOptions = extendedOptions;
      }
    );

    this.suggestedHashtagsComponent.extendedOptions$.subscribe((extendedOptions: TemplateMultiSelectFormOption[]) => {
      this.suggestedExtendedOptions = extendedOptions;
    });
  }

  public searchedValidStatusChange(valid): void {
    this.showSearchedErrorMessage = !valid;
  }

  public suggestionsScrolled(): void {
    this.getSuggestedOptions(this.suggestedOptionsPage);
    this.hashtagForm.controls[HASHTAG_TYPE.SUGGESTED].setValue(this.value, { emitEvent: false });
  }

  public removeValue(valueString: string) {
    this.value = this.value.filter((value) => valueString !== value);
    this.onChange(this.value);
    this.writeValue(this.value);
  }

  public writeValue(value: MultiSelectValue): void {
    super.writeValue(value);
    this.hashtagForm.setValue({ [HASHTAG_TYPE.SUGGESTED]: this.value, [HASHTAG_TYPE.SEARCHED]: this.value }, { emitEvent: false });
    this.updateMaxReached();
  }

  private manageFormChanges(extendedOptions: TemplateMultiSelectFormOption[], type: HASHTAG_TYPE) {
    const fieldToModify = type === HASHTAG_TYPE.SEARCHED ? HASHTAG_TYPE.SUGGESTED : HASHTAG_TYPE.SEARCHED;
    this.value = this.mapExtendedOptionsToValue(extendedOptions);
    this.hashtagForm.controls[fieldToModify].setValue(this.value, { emitEvent: false });
    this.onChange(this.value);
    this.updateMaxReached();
  }

  private mapExtendedOptionsToValue(extendedOptions: TemplateMultiSelectFormOption[]): string[] {
    let newValue: string[] = this.value;
    const valuesToAdd = extendedOptions.filter((opt) => opt.checked).map((opt) => opt.value);
    const valuesToRemove = extendedOptions.filter((opt) => !opt.checked).map((opt) => opt.value);
    newValue = union(newValue, valuesToAdd);
    newValue = newValue.filter((value) => !valuesToRemove.includes(value));

    return newValue;
  }

  private getSuggestedOptions(page: number): void {
    if (page !== null) {
      this.hashtagSuggesterApiService.getHashtags(this._categoryId, page.toString()).subscribe((n) => {
        this.suggestedOptionsPage = n.paginationParameter;
        const options = this.mapHashtagOptions(n);
        this.suggestedOptions = page ? this.suggestedOptions.concat(options) : options;
        this.suggestedOptionsSubject.next(this.suggestedOptions);
      });
    }
  }

  private mapHashtagOptions(hashtags: PaginatedList<Hashtag>): MultiSelectFormOption[] {
    let suggestedOptions: SelectFormOption<string>[] = [];

    hashtags.list.forEach((hashtag: Hashtag) => {
      suggestedOptions.push({ label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: hashtag.text });
    });
    return suggestedOptions;
  }

  private updateMaxReached(): void {
    this.maxReachedSubject.next(this.value.length === this.max);
  }
}
