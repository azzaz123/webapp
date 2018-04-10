import { Component, Input } from '@angular/core';
import { User } from '../../../core/user/user';

@Component({
  selector: 'tsl-user-type',
  templateUrl: './user-type.component.html'
})
export class UserTypeComponent {

  @Input() user: User;

  constructor() {
  }

}
