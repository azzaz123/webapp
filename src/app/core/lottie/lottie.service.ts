import { Injectable } from '@angular/core';
import { LottiePlayer } from 'lottie-web';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LottieService {
  private lottiePlayer: LottiePlayer;

  public get lottiePlayer$(): Observable<LottiePlayer> {
    if (this.lottiePlayer) {
      return of(this.lottiePlayer);
    }
    return from(import('lottie-web')).pipe(
      map((libraryRef) => libraryRef.default),
      tap((ref) => (this.lottiePlayer = ref)),
      shareReplay(1)
    );
  }
}
