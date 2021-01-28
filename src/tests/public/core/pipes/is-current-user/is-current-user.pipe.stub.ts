import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'isCurrentUser',
})
export class IsCurrentUserStub implements PipeTransform {
  isCurrentUser = false;
  transform(userId: string): Observable<boolean> {
    return of(this.isCurrentUser);
  }
}
