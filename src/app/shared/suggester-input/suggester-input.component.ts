import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HashtagSuggesterApiService } from '../../private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
@Component({
  selector: 'tsl-suggester-input',
  templateUrl: './suggester-input.component.html',
  styleUrls: ['./suggester-input.component.scss'],
})
export class SuggesterInputComponent implements OnInit {
  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {}
  ngOnInit() {
    this.detectTitleKeyboardChanges();
    this.form.get('select').valueChanges.subscribe((val) => {
      console.log('');
      this.onChangeHashtag.emit(val);
    });
  }

  @Input() categoryId: string = '1000'; // When PR: need to modify
  @ViewChild('hashtagSuggester', { static: true }) hashtagSuggester: ElementRef;
  @Output() onChangeHashtag: EventEmitter<string[]> = new EventEmitter();
  public selected: string[];
  public start: string = '0';
  public model: string;
  public options: SelectFormOption<string>[] = [];
  public form = new FormGroup({
    select: new FormControl([]),
  });
  public detectTitleKeyboardChanges(): void {
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => {
        if (!this.isValidKey()) {
          console.log('not valid');
          return;
        } else
          this.getHashtags().subscribe((m) => {
            this.options = this.mapHashtagsToOptions(m);
          });
      });
  }

  public isValidKey(): boolean {
    // filter valid key,  managemge space key (whether we want to put space in prefix) - AC8

    /*  const pattern: RegExp = /#([\\p{L}]+[\\p{N}_]*)+/m;
    //    const pattern: RegExp = /^(?=.{1,50}$)[\p{L}\p{M}\\p{N}\p{Me}€$\+]+(?:[-–_]?[\p{L}\p{M}\p{N}\p{Me}]+|[\p{L}\p{M}\p{N}\p{Me}]*)$/;
    console.log('tt', this.model, pattern.test(this.model));
    return pattern.test(this.model); */
    return true;
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
    return [{ label: this.model, value: this.model }];
  }
}
