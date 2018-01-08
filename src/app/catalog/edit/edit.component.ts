import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'shield';

@Component({
  selector: 'tsl-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public item: Item;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.item = this.route.snapshot.data['item'];
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

}
