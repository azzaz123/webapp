import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlidesCarouselComponent } from '@shared/components/carousel-slides/carousel-slides.component';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-modal-constants';

@Component({
  selector: 'tsl-kyc-info-modal',
  templateUrl: './kyc-info-modal.component.html',
  styleUrls: ['./kyc-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycInfoModalComponent {
  @ViewChild(SlidesCarouselComponent, { static: true }) slidesCarousel: SlidesCarouselComponent;
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;
  public readonly LAST_SLIDE = 'ngb-slide-2';

  constructor(public activeModal: NgbActiveModal) {}

  public swipeToRight(): void {
    this.slidesCarousel.carousel.next();
  }

  get currentSlide(): string {
    return this.slidesCarousel.currentSlide;
  }
}
