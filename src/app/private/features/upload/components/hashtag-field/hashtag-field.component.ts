import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

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
  /* public disabled: boolean = (this.form.value.hashtags.length === this.maxHashtagsNumber) */
  public searchedOptions = [
    { label: '#searched', value: '#searched' },
    { label: '#faa', value: '#faa' },
    { label: '#d', value: '#d' },
    { label: '#xx', value: '#xx' },
  ];

  ngOnInit() {
    this.form.valueChanges.subscribe((val: string[]) => {
      console.log('hashtags', this.form.get('hashtags').value, 'searchedHashtags', this.form.get('searchedHashtags').value);
      const bindedValue = this.bindFormValues();
      //this.form.patchValue(bindedValue, { emitEvent: false });
      this.form.get('hashtags').patchValue(bindedValue, { emitEvent: false });
      this.form.get('searchedHashtags').patchValue(bindedValue, { emitEvent: false });
      console.log('value', this.form);
    });

    //this.loadMore();
  }

  public bindFormValues(): string[] {
    const loadedHashtags = this.form.get('hashtags').value;
    const searchedHashtags = this.form.get('searchedHashtags').value;

    let array = loadedHashtags.concat(searchedHashtags);
    array = [...new Set([...loadedHashtags, ...searchedHashtags])];

    console.log('a', array);
    return array;
  }

  public loadMore(event): void {
    /*  let lastOption = this.generalHashtagForm.nativeElement.childNodes[0].children;
    let parentDiv = this.generalHashtagForm.nativeElement.childNodes[0]; */
    // console.log(event.target.offsetTop, event.target.scrollTop, event.target.scrollHeight, lastOption[6].offsetTop);
    /*   if (lastOption[6].offsetTop === event.target.offsetTop) {
      this.page++;
      console.log('Bottom', 'child page', this.page, this.page.toString());
      this.start.emit(this.page.toString());
    } */
    console.log(event.target.offsetHeight, event.target.scrollTop, event.target.offsetTop);
    if ((event.target.scrollTop = event.target.offsetTop)) {
      console.log('bottom');
      this.page++;
      this.start.emit(this.page.toString());
      return;
    }
    /* let lastOption = this.generalHashtagForm.nativeElement.childNodes[0].children;
    let parentDiv = this.generalHashtagForm.nativeElement.childNodes[0];

    console.log(parentDiv.bodyClientHeight, parentDiv.scrollHeight, parentDiv.offsetTop, lastOption, lastOption[5].offsetTop);
 */ // console.log('loadmoar', this.multiSelectForm.nativeElement);
  }
}
