import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public categoryId: string;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor() {
  }

  ngOnInit() {

  }

  public setCategory(categoryId: string) {
    this.categoryId = categoryId;
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

}
