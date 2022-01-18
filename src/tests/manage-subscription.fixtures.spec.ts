import { Observable, of } from 'rxjs';

export class MockManageSubscriptionService {
  public cancelSubscription(): Observable<boolean> {
    return of(true);
  }

  public continueSubscription(): Observable<boolean> {
    return of(true);
  }
}
