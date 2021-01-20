import { map } from 'lodash-es';
import { Pipe, PipeTransform } from '@angular/core';
import { Profile, selectUserProfileDetail } from '@data/user';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Pipe({
  name: 'isCurrentUser',
})
export class IsCurrentUserPipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(userId: string): Observable<boolean> {
    return this.store
      .select(selectUserProfileDetail)
      .pipe(map((user: Profile | null) => user?.id === userId));
  }
}
