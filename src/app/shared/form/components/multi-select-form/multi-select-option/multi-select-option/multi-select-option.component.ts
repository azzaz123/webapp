import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
})
export class MultiSelectOptionComponent implements OnInit {
  @Input() option: string;
  @Input() isChecked: boolean;

  constructor() {}

  ngOnInit(): void {}
}
