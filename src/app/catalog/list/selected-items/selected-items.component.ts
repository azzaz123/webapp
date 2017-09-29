import { Component, HostBinding, OnInit } from '@angular/core';
import { animate, transition, trigger } from '@angular/animations';
import { style } from '@angular/core/src/animation/dsl';

@Component({
  selector: 'tsl-selected-items',
  templateUrl: './selected-items.component.html',
  styleUrls: ['./selected-items.component.scss']/*,
  animations: [
    trigger('enterFromBottom', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('500ms', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0%)'}),
        animate('500ms', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]*/
})
export class SelectedItemsComponent implements OnInit {

  @HostBinding('@enterFromBottom') public animation: void;

  constructor() {
  }

  ngOnInit() {
  }

}
