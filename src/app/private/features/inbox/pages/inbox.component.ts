import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  constructor(
    public router: Router // @Inject(DOCUMENT) private document: Document,
  ) // @Inject(LOCALE_ID) private locale: APP_LOCALE
  {}
}
