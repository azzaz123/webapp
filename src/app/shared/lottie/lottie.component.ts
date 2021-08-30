import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { LottieService } from '@core/lottie/lottie.service';
import { AnimationItem } from 'lottie-web';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tsl-lottie',
  templateUrl: './lottie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LottieComponent implements AfterViewInit, OnDestroy {
  @Input() src: string;
  @Input() loop = true;
  @ViewChild('lottieContainer') private lottieContainer: ElementRef;
  public iconsSizePercentatge = 25;
  public fallbackIconSrc = '/assets/icons/picture.svg';
  public loadingIconSrc = '/assets/icons/spinner.svg';
  public loading$ = new BehaviorSubject(true);
  public showLottie$ = new BehaviorSubject(true);
  public error$ = new BehaviorSubject(false);

  private animationItem: AnimationItem;
  constructor(private lottieService: LottieService) {}

  ngAfterViewInit(): void {
    this.lottieService.lottiePlayer$.subscribe((lottiePlayer) => {
      // Delegate protocol selection to browser
      const path = this.stripProtocolFromSrcIfExists(this.src);

      this.animationItem = lottiePlayer.loadAnimation({
        container: this.lottieContainer.nativeElement,
        loop: this.loop,
        renderer: 'svg',
        path,
      });

      this.animationItem.addEventListener('data_ready', () => this.handleDataReady());
      this.animationItem.addEventListener('data_failed', () => this.handleDataFailed());
      this.animationItem.addEventListener('error', () => this.handleError());
    });
  }

  ngOnDestroy(): void {
    this.animationItem?.destroy();
  }

  private stripProtocolFromSrcIfExists(src: string): string {
    return src.replace(/^https?:/, '');
  }

  private handleDataReady(): void {
    this.loading$.next(false);
  }

  private handleDataFailed(): void {
    this.error$.next(true);
    this.loading$.next(false);
  }

  private handleError(): void {
    this.showLottie$.next(false);
    this.error$.next(true);
    this.loading$.next(false);
  }
}
