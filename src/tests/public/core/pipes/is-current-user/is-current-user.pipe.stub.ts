import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isCurrentUser',
})
export class IsCurrentUserStub implements PipeTransform {
  transform(userId: string): boolean {
    return false;
  }
}
