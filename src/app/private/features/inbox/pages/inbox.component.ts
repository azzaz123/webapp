import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SELLBYTEL_PHONE, CARDEALER_COMMERCIAL_CONTACT_MAIL } from '@core/constants';

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  constructor(private route: ActivatedRoute) // @Inject(DOCUMENT) private document: Document,
  // @Inject(LOCALE_ID) private locale: APP_LOCALE
  {}
}
