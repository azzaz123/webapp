import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss'],
})
export class NewSubscriptionComponent implements OnInit {
  @Input() subscription;
  constructor() {}

  ngOnInit(): void {}
}
