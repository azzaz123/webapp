import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../core/user/user';

@Component({
  selector: 'tsl-user-response-rate',
  templateUrl: './user-response-rate.component.html',
  styleUrls: ['./user-response-rate.component.scss']
})
export class UserResponseRateComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
