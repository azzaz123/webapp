import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { Hashtag } from '../../core/models/hashtag.interface';
import { HashtagSuggesterApiService } from '../../core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { union } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';

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
export class HashtagFieldComponent extends AbstractFormComponent<MultiSelectValue> implements OnInit {
  @Input() categoryId: string;
  @Input() max: number;

  public hashtagForm: FormGroup = new FormGroup({ searched: new FormControl(), suggested: new FormControl() });

  private suggestedOptionsSubject = new BehaviorSubject<MultiSelectFormOption[]>([]);
  private suggestedOptions: MultiSelectFormOption[] = [];
  private suggestedOptionsPage;

  constructor(private hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }

  public get suggestedOptions$(): Observable<MultiSelectFormOption[]> {
    return this.suggestedOptionsSubject.asObservable();
  }

  ngOnInit() {
    this.hashtagForm.valueChanges.subscribe((changes: { searched: MultiSelectValue; suggested: MultiSelectValue }) => {
      this.value = union(changes.searched, changes.suggested);
      this.onChange(this.value);
      this.isDisabled = this.value.length > this.max;
    });

    this.getSuggestedOptions(0);
  }

  public suggestionsScrolled(): void {
    this.getSuggestedOptions(this.suggestedOptionsPage);
  }

  public removeValue(valueString: string) {
    this.value = this.value.filter((value) => valueString !== value);
    this.writeValue(this.value);
  }

  private getSuggestedOptions(page: number): void {
    if (page !== null) {
      this.hashtagSuggesterApiService.getHashtags(this.categoryId, page.toString()).subscribe((n) => {
        this.suggestedOptionsPage = n.paginationParameter;
        this.mapHashtagOptions(n);
      });
    }
  }

  private mapHashtagOptions(hashtags: PaginatedList<Hashtag>) {
    let suggestedOptions: SelectFormOption<string>[] = [];

    hashtags.list.forEach((hashtag: Hashtag) => {
      suggestedOptions.push({ label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: hashtag.text });
    });

    this.suggestedOptions = this.suggestedOptions.concat(suggestedOptions);
    this.suggestedOptionsSubject.next(this.suggestedOptions);
  }
}
