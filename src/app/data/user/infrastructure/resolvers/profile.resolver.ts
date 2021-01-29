import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoadUserProfile } from './../../actions';

@Injectable()
export class ProfileResolver implements Resolve<void> {

  constructor(private store: Store) {}

  resolve(): void {
    this.store.dispatch(LoadUserProfile());
  }
}
