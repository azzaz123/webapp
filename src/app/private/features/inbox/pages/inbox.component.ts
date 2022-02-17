import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  constructor(public router: Router) {}
}
