import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public categoryId: string;

  constructor() {
  }

  ngOnInit() {

  }

  public setCategory(categoryId: string) {
    this.categoryId = categoryId;
  }

}
