import { Component, OnInit, Input } from '@angular/core';
import { User } from 'shield';

@Component({
  selector: 'tsl-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
