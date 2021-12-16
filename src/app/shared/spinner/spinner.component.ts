import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() firstLoad: boolean;
}
