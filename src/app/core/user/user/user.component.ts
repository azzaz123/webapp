import { Component, Input } from '@angular/core';
import { User } from 'shield';

@Component({
  selector: 'tsl-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input() user: User;
  @Input() phone: string;

  constructor() {
  }

}
