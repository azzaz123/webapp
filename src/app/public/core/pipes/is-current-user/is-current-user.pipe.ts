import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '@core/user/user.service';

@Pipe({
  name: 'isCurrentUser',
})
export class isCurrentUserPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  transform(userId: string): boolean {
    return this.userService.user ? userId === this.userService.user.id : false;
  }
}
