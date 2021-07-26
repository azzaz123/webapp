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
import { fromEvent, Observable } from 'rxjs';
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
    console.log('comp', this.multiSelectFormComponent, this.suggestions);
  }

  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => {
        if (!this.isValidKey()) {
          console.log('not valid');
          return;
        } else
          this.getHashtags().subscribe((m) => {
            console.log('comp', this.multiSelectFormComponent);
            this.options = this.mapHashtagsToOptions(m);
          });
      });
  }

  public writeValue(value): void {
    this.value = value;
    console.log('writevalue suggesterInput', this.value);
  }

  public handleSelectedOption(): void {
    this.onChange(this.value.concat(this.suggestions));
  }

  public isValidKey(): boolean {
    const pattern: RegExp = /^#?([\p{L}\p{Nd}])+$/u;
    return pattern.test(this.model);
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
    /* this.multiSelectFormComponent.extendedOptions$.pipe(
      tap((option) => {
        option[0].checked = true;
      })
    ); */
    // this.multiSelectFormComponent.options = [{ label: this.model, value: this.model }];
    return [{ label: this.model, value: this.model }];
  }
}
