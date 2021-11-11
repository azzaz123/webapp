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

  @ViewChild(MultiSelectFormComponent) generalHashtagForm: MultiSelectFormComponent;
  public page: number = 0;
  public hashtagForm: FormGroup = new FormGroup({ search: new FormControl(), suggested: new FormControl() });

  private optionsSubject = new BehaviorSubject<SelectFormOption<string>[]>([]);

  constructor(private hashtagSuggesterApiService: HashtagSuggesterApiService) {
    super();
  }

  public get options$(): Observable<SelectFormOption<string>[]> {
    return this.optionsSubject.asObservable();
  }

  ngOnInit() {
    this.hashtagForm.valueChanges.subscribe((changes: { search: MultiSelectValue; suggested: MultiSelectValue }) => {
      this.value = union(changes.search, changes.suggested);
      this.onChange(this.value);
      this.isDisabled = this.value.length > this.max;
    });

    this.hashtagSuggesterApiService.getHashtags(this.categoryId, '0').subscribe((n) => {
      this.mapHashtagOptions(n);
    });
  }

  public removeValue(valueString: string) {
    this.value = this.value.filter((value) => valueString !== value);
    this.writeValue(this.value);
  }

  private mapHashtagOptions(hashtags: PaginatedList<Hashtag>) {
    let options: SelectFormOption<string>[] = [];

    hashtags.list.forEach((hashtag: Hashtag) => {
      options.push({ label: `#${hashtag.text}`, sublabel: hashtag.occurrences.toString(), value: hashtag.text });
    });

    this.optionsSubject.next(options);
  }
}
