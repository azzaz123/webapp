import { Pipe, PipeTransform } from '@angular/core';
import { selectUserProfileDetailId, UserId } from '@data/user';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'isCurrentUser',
})
export class IsCurrentUserPipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(userId: string): Observable<boolean> {
    return this.store.select(selectUserProfileDetailId).pipe(map((userIdStore: UserId | null) => userIdStore === userId));
  }
}
