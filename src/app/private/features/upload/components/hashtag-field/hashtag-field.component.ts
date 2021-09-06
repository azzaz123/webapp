import { JsonpClientBackend } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { distinctUntilChanged, pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'tsl-hashtag-field',
  templateUrl: './hashtag-field.component.html',
  styleUrls: ['./hashtag-field.component.scss'],
})
export class HashtagFieldComponent implements OnInit {
  @Input() options: SelectFormOption<string>[];
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Output() start = new EventEmitter<string>();
  @ViewChild('generalHashtagForm') generalHashtagForm: ElementRef;
  public maxHashtagsNumber: number = 5;
  public page: number = 0;

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        startWith({ hashtags: [], searchedHashtags: [] }),
        distinctUntilChanged((prev, next) => {
          return JSON.stringify(prev) === JSON.stringify(next);
        }),
        pairwise()
      )
      .subscribe(([prev, next]) => {
        this.onChangeFormControlValue(prev, next); // Problem might be here, change this code to the code below
        this.form.patchValue(next, { emitEvent: true });
      });
  }

  private onChangeFormControlValue(prev, next): void {
    let formToBePatched: string;
    let modifiedForm: string;
    // Compare the property of object and only patch the one that is not changed
    if (prev.hashtags.length !== next.hashtags.length) {
      formToBePatched = 'searchedHashtags';
      modifiedForm = 'hashtags';
    } else if (prev.searchedHashtags.length !== next.searchedHashtags.length) {
      formToBePatched = 'hashtags';
      modifiedForm = 'searchedHashtags';
    }
    if (next[modifiedForm].length > prev[modifiedForm].length) {
      const lastItemIndex = next[modifiedForm].length - 1;
      const newSelected = next[modifiedForm][lastItemIndex];
      // Add it and remove the repeated value (Add it and remove it if it was already selected)
      next[formToBePatched].push(newSelected);
      next[formToBePatched] = next[formToBePatched].filter((item, pos, self) => self.indexOf(item) === pos); // Remove repeate value
    } else {
      const hashtagToRemove = prev[modifiedForm].find((n) => {
        return !next[modifiedForm].includes(n);
      });
      next[formToBePatched] = next[formToBePatched].filter((n) => {
        return n !== hashtagToRemove;
      });
    }
  }
}
