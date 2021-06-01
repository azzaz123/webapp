import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '@core/user/user.service';

@Pipe({
  name: 'isCurrentUser',
})
export class IsCurrentUserPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  transform(userId: string): boolean {
    return this.userService.isLogged && this.userService.user.id === userId;
  }
}
