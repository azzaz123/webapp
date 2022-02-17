import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'tsl-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss'],
})
export class InboxPageComponent {
  constructor(public router: Router) {}
}
