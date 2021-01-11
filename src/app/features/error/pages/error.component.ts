import { Component } from '@angular/core';

@Component({
  selector: 'tsl-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public title = 'To be defined';
  public subtitle = 'This is content-box component';

  constructor() {}
}
